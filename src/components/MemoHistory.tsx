import React from 'react';
import { MemoTransaction } from './MemoApp';

interface MemoHistoryProps {
  memos: MemoTransaction[];
}

const MemoHistory: React.FC<MemoHistoryProps> = ({ memos }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateSignature = (signature: string) => {
    return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const getExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  if (memos.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
        <p>No memos sent yet. Send your first memo above!</p>
      </div>
    );
  }

  return (
    <div>
      {memos.map((memo, index) => (
        <div key={memo.signature} className="memo-item">
          <div className="memo-content">
            <strong>Memo #{memos.length - index}:</strong> {memo.memo}
          </div>
          <div className="memo-meta">
            <div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Transaction:</strong>{' '}
                <a
                  href={getExplorerUrl(memo.signature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="signature-link"
                >
                  {truncateSignature(memo.signature)}
                </a>
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Signers ({memo.signers.length}):</strong>{' '}
                {memo.signers.map((signer, idx) => (
                  <span key={signer}>
                    {truncateAddress(signer)}
                    {idx < memo.signers.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {formatDate(memo.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoHistory;