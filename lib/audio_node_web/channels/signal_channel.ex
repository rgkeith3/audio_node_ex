defmodule AudioNodeWeb.SignalChannel do
  use Phoenix.Channel

  def join("signal:"<> _uid, _payload, socket) do
    {:ok, socket}
  end

  def handle_in("sender-ready", %{"targetUuid" => target_uuid}, socket) do
    GenServer.call(ReadyState, {:sender_ready, %{sender: socket.assigns.session_uuid, receiver: target_uuid}}, :infinity)
    |> maybe_kickoff_negotiation()
    {:noreply, socket}
  end

  def handle_in("receiver-ready", %{"targetUuid" => target_uuid}, socket) do
    GenServer.call(ReadyState, {:receiver_ready, %{sender: target_uuid, receiver: socket.assigns.session_uuid}}, :infinity)
    |> maybe_kickoff_negotiation()
    {:noreply, socket}
  end

  def handle_in("offer", %{"targetUuid" => uuid, "offer" => offer}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{uuid}", "offer", %{from: socket.assigns.session_uuid, offer: offer})
    {:noreply, socket}
  end

  def handle_in("answer", %{"targetUuid" => uuid, "answer" => answer}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{uuid}", "answer", %{from: socket.assigns.session_uuid, answer: answer})
    {:noreply, socket}
  end

  def handle_in("ice-candidate", %{"targetUuid" => uuid, "candidate" => candidate}, socket) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{uuid}", "ice-candidate", %{from: socket.assigns.session_uuid, candidate: candidate})
    {:noreply, socket}
  end

  defp maybe_kickoff_negotiation(nil), do: nil
  defp maybe_kickoff_negotiation(%{sender: sender_uuid, receiver: receiver_uuid}) do
    AudioNodeWeb.Endpoint.broadcast_from!(self(), "signal:#{sender_uuid}", "kickoff", %{receiver: receiver_uuid})
  end
end
