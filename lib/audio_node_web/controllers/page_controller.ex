defmodule AudioNodeWeb.PageController do
  use AudioNodeWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
