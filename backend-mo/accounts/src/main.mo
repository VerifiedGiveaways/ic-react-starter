import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
