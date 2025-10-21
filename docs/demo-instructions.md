# CoralKM Protocol Demo Insturction

## 1. Setup

1. Make sure the Cloudflare Wallet Gateway is running first, then open the Wallet page on several tabs
1. On startup, the Wallet will start with `Unknown User`, connect to the Wallet Gateway and establish a DIDComm mediation/routing connection over websockets. This will create a new Routing DID for the Wallet which is shown at the top of the page next to the User's name.

   It also requests a new Namespace for the Wallet with the Wallet Gateway and syncs the Wallet backup data everytime the Wallet data is changed (i.e. adding a Guardian share for another wallet, or new keys/DIDs) in the background.

   Every time a new Channel is added, it will automatically run the User Profile and Discover Features protocols to get the User Profile information and discover what DIDComm protocols they support. If it see's the CoralKM protocol is supported, it will add an empty Shield next to their name in the Contacts list on the left.

1. Use the top left User Profile dropdown to assign different names to each Wallet tab. For the demo we will use Alice as the primary user. You can view all her wallet information and DIDs by clicking on the top Info icon.
1. Using the copy button at the top, copy the routing DIDs of each Wallet, and add as new Contacts to Alice's wallet using the plus button at the top of the Contacts list until all the Guardian wallets are connected to Alice and appear in the left list.

## 2. Request Guardianship

1. Go to each Contact in the list, open the message view, and click on the Green `Request Guardianship` button at the bottom. You will see the Sheild turn to a Shield with a tick to indicate it is a Guardian for this wallet, and once you have more than 2 Guardians, you will start seeing Share messages in each channel as it automatically updates the Data Encryption Key (DEK) shares to adjust for the number of Guardians the wallet has.
1. If the Contact is a Guardian, you can also click the Red `Revoke Guardianship` button at the bottom to remove the Contact as a Guardian, and you will see automatic share updates among the remaining Guardians to adjust for the new number of Guardians.

## Recover Wallet

1. Open Alice's Wallet Info, and copy the Namespace JSON in the right drawer.
1. Open a new Wallet tab which will setup with Unknown User. Click on the top Shield icon beside the new Wallet's routing DID, to open the Recovery Modal
1. Past the Namespace JSON into the modal text area and click `Recover` to start the process
1. In the background, a Recovery Request with the new Wallet's routing DID will be broadcast via the Wallet Gateway to all Wallets, which will check to see if they're a Guardian for the Namespace, and start their own Identity Verification processes
1. For the Demo, the Verficiation Process is automated in-band via DIDComm to the new Wallet, which sends a verification code request and automatically replies back with `123456` to verify the User's Identity and ownership of the new device. In real-life, Identity Verification Challenges will usually be out-of-band (i.e. sent via postal mail, email, SMS or in person), and also have a time-lock of at least 24hrs before releasing their share after successful verification.
1. Once the wallet has received the required threshold number of shares to combine back into the DEK, it will fetch the Wallet backup and decrypt it using the key to show the Recovery was successful. This will pop up a modal to show the result. In future, the Wallet will automatically refresh with the old Wallet's data and contacts and be able to assume the identiy of Alice's wallet.
