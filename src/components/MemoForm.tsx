import React, { useState } from 'react';
import { web3 } from '@coral-xyz/anchor';
import { toast } from 'react-toastify';

interface MemoFormProps {
  onSendMemo: (memo: string, signers: web3.Keypair[]) => Promise<void>;
  loading: boolean;
}

interface Signer {
  id: string;
  publicKey: string;
  privateKey: string;
}

const MemoForm: React.FC<MemoFormProps> = ({ onSendMemo, loading }) => {
  const [memo, setMemo] = useState('');
  const [signers, setSigners] = useState<Signer[]>([]);

  const addSigner = () => {
    const keypair = web3.Keypair.generate();
    const newSigner: Signer = {
      id: Date.now().toString(),
      publicKey: keypair.publicKey.toString(),
      privateKey: Array.from(keypair.secretKey).join(','),
    };
    setSigners([...signers, newSigner]);
  };

  const removeSigner = (id: string) => {
    setSigners(signers.filter(signer => signer.id !== id));
  };

  const updateSignerPrivateKey = (id: string, privateKey: string) => {
    setSigners(signers.map(signer => 
      signer.id === id ? { ...signer, privateKey } : signer
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memo.trim()) {
      toast.error('Please enter a memo message');
      return;
    }

    if (memo.length > 566) {
      toast.error('Memo message is too long (max 566 characters)');
      return;
    }

    try {
      const signerKeypairs = signers.map(signer => {
        try {
          const secretKey = new Uint8Array(signer.privateKey.split(',').map(Number));
          return web3.Keypair.fromSecretKey(secretKey);
        } catch (error) {
          throw new Error(`Invalid private key for signer ${signer.publicKey}`);
        }
      });

      await onSendMemo(memo, signerKeypairs);
      setMemo('');
      setSigners([]);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="label">Memo Message</label>
        <textarea
          className="textarea"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Enter your memo message here..."
          maxLength={566}
          disabled={loading}
        />
        <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
          {memo.length}/566 characters
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <label className="label">Additional Signers (Optional)</label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addSigner}
            disabled={loading}
          >
            Add Signer
          </button>
        </div>
        
        {signers.map((signer) => (
          <div key={signer.id} className="signer-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Public Key:</div>
              <input
                type="text"
                className="input signer-input"
                value={signer.publicKey}
                readOnly
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Private Key:</div>
              <input
                type="text"
                className="input signer-input"
                value={signer.privateKey}
                onChange={(e) => updateSignerPrivateKey(signer.id, e.target.value)}
                placeholder="Enter private key as comma-separated numbers"
                style={{ fontSize: '12px', fontFamily: 'monospace' }}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeSigner(signer.id)}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}
        
        {signers.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
            No additional signers. The memo will be signed only by your connected wallet.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn"
        disabled={loading || !memo.trim()}
        style={{ width: '100%' }}
      >
        {loading ? (
          <>
            <span className="loading"></span>
            <span style={{ marginLeft: '10px' }}>Sending Memo...</span>
          </>
        ) : (
          'Send Memo'
        )}
      </button>
    </form>
  );
};

export default MemoForm;