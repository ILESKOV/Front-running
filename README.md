[Ethereum is a Dark Forest](https://www.paradigm.xyz/2020/08/ethereum-is-a-dark-forest)


[How to Survive in the Ethereum Dark Forest](https://betterprogramming.pub/how-to-survive-in-the-ethereum-dark-forest-f21c9eca4bfe)


[Quick start with flashbots](https://docs.flashbots.net/flashbots-auction/searchers/quick-start)


[MEV bots repo](https://github.com/flashbots/mev-job-board)


[Flash Boys 2.0](https://arxiv.org/pdf/1904.05234.pdf)


[Ethereum Smart Contract Best Practices FrontRunning](https://consensys.github.io/smart-contract-best-practices/attacks/frontrunning/)


[Batch Auctions](https://www.bitdegree.org/crypto/learn/crypto-terms/what-are-batch-auctions)




### Front Running Prevention: Commit - Reveal
 The best remediation is to remove the benefit of front-running in your application, mainly by removing the importance of transaction ordering or time.
Commit - Reveal:
1. Indicate intent to do some action (claim a bounty, propose a purchase or sale), submit a commitment:
○ Submit: keccak256(encoded action, msg.sender)
○ Contract stores the commitment (message digest)
2. To execute the action, reveal the proposed action:
○ Submit: encoded action
○ Contract checks that the commitment == keccak256(encoded action, msg.sender)


