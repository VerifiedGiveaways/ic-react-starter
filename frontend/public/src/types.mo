import Nat16 "mo:base/Nat16";
import Blob "mo:base/Blob";
import Text "mo:base/Text";

module {
  public type HttpRequest = {
      method: Text;
      url: Text;
      headers: [(Text, Text)];
      body: Blob;
  };
  public type HttpResponse = {
      status_code: Nat16;
      headers: [(Text, Text)];
      body: Blob;
  };
}