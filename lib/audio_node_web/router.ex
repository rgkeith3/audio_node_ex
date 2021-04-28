defmodule AudioNodeWeb.Router do
  use AudioNodeWeb, :router

  alias AudioNodeWeb.Generator

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_session_uuid
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", AudioNodeWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  defp put_session_uuid(conn, _) do
    assign(conn, :session_uuid, Generator.gen_reference())
  end
end
