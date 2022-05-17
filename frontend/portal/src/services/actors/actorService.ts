import { ActorSubclass, AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

import { _SERVICE as AccountService } from "../../services/actors/accounts/accounts.did";
import {
  canisterId as accountCanisterId,
  createActor as createAccountActor,
} from "./accounts/index";

export async function getAccountActor(): Promise<
  ActorSubclass<AccountService>
> {
  var identity: Principal | null = null; //(await useAuthStore?.getState().getIdentity()) || new AnonymousIdentity();
  return createAccountActor(accountCanisterId as string, {
    agentOptions: { identity: identity || new AnonymousIdentity() },
  });
}
