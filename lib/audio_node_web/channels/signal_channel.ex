defmodule AudioNodeWeb.SignalChannel do
  use Phoenix.Channel

  def join("signal:"<> _uid, _payload, socket) do
    {:ok, socket}
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
end
