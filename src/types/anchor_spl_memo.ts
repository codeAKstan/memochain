export type AnchorSplMemo = {
  "version": "0.1.0",
  "name": "anchor_spl_memo",
  "instructions": [
    {
      "name": "sendMemo",
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
  "instructions": [
    {
      "name": "sendMemo",
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