import assert from 'node:assert/strict';
import { redirectUrl, sendMagicLink, currentAccount, signOutAccount } from './my-journey-auth.mjs';
assert.equal(redirectUrl(), 'https://nolabelsdesignedbygod.org/journey-auth.html');
assert.throws(() => redirectUrl('https://evil.example'), /Unapproved/);
assert.throws(() => redirectUrl('http://nolabelsdesignedbygod.org'), /Unapproved/);
let payload;
const client={auth:{
  signInWithOtp: async p=>{payload=p;return {error:null};},
  getUser:async()=>({data:{user:{id:'test'}}}),
  signOut:async()=>({error:null})
}};
await assert.rejects(sendMagicLink(client,'bad-email'),/valid email/);
await sendMagicLink(client,' Person@Example.org ');
assert.equal(payload.email,'person@example.org');
assert.equal(payload.options.emailRedirectTo,redirectUrl());
assert.equal(payload.options.shouldCreateUser,true);
assert.equal((await currentAccount(client)).id,'test');
await signOutAccount(client);
console.log('Passwordless auth adapter checks passed');
