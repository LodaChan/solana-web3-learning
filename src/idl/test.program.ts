export default {
  "version": "0.1.0",
  "name": "test_anchor_program",
  "instructions": [
    {
      "name": "sayHello",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeCounter",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ]
};