export type AnchorSplMemo = {
  "version": "0.1.0",
  "name": "anchor_spl_memo",
  "address": "2p1eq5RNKv4MrESEPtA9za96diQnRHxLd48gz33Yq7r4",
  "metadata": {
    "name": "anchor_spl_memo",
    "version": "0.1.0",
    "spec": "0.1.0",
    "address": "2p1eq5RNKv4MrESEPtA9za96diQnRHxLd48gz33Yq7r4"
  },
  "instructions": [
    {
      "name": "sendMemo",
      "discriminator": [0, 1, 2, 3, 4, 5, 6, 7],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "memo",
          "type": "string"
        }
      ]
    }
  ]
};

export const IDL: AnchorSplMemo = {
  "version": "0.1.0",
  "name": "anchor_spl_memo",
  "address": "2p1eq5RNKv4MrESEPtA9za96diQnRHxLd48gz33Yq7r4",
  "metadata": {
    "name": "anchor_spl_memo",
    "version": "0.1.0",
    "spec": "0.1.0",
    "address": "2p1eq5RNKv4MrESEPtA9za96diQnRHxLd48gz33Yq7r4"
  },
  "instructions": [
    {
      "name": "sendMemo",
      "discriminator": [0, 1, 2, 3, 4, 5, 6, 7],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "memoProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "memo",
          "type": "string"
        }
      ]
    }
  ]
};