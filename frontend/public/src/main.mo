import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Types "./types";

actor Frontend {
  type HttpRequest = Types.HttpRequest;
  type HttpResponse = Types.HttpResponse;

  // Example: http://<user_canister_id>.localhost:8000/path
  public query func http_request(req: HttpRequest): async HttpResponse {
      let body = Text.encodeUtf8("Hello World");
      {
          status_code = 200;
          headers = [("Content-Type", "text/plain; version=0.0.4"), ("Content-Length", Nat.toText(body.size()))];
          body = body;
      };
  };
};
