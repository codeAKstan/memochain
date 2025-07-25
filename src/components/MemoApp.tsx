import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, web3, Idl } from '@coral-xyz/anchor';
import { toast } from 'react-toastify';
import MemoForm from './MemoForm';
import MemoHistory from './MemoHistory';
import { IDL } from '../types/anchor_spl_memo';

const PROGRAM_ID = new web3.PublicKey('2p1eq5RNKv4MrESEPtA9za96diQnRHxLd48gz33Yq7r4');
const MEMO_PROGRAM_ID = new web3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export interface MemoTransaction {
  signature: string;
  memo: string;
  timestamp: number;
  signers: string[];
}

const MemoApp: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [memos, setMemos] = useState<MemoTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wallet.publicKey && wallet.signTransaction) {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      const program = new Program(IDL as Idl, provider);
      setProgram(program);
    } else {
      setProgram(null);
    }
  }, [connection, wallet]);

  useEffect(() => {
    // Load memos from localStorage on component mount
    const savedMemos = localStorage.getItem('solana-memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  const saveMemos = (newMemos: MemoTransaction[]) => {
    setMemos(newMemos);
    localStorage.setItem('solana-memos', JSON.stringify(newMemos));
  };

  const sendMemo = async (memo: string, signers: web3.Keypair[]) => {
    if (!program || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const remainingAccounts = signers.map(signer => ({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      }));

      const tx = await program.methods
        .sendMemo(memo)
        .accounts({
          payer: wallet.publicKey,
          memoProgram: MEMO_PROGRAM_ID,
        })
        .remainingAccounts(remainingAccounts)
        .signers(signers)
        .rpc();

      const newMemo: MemoTransaction = {
        signature: tx,
        memo,
        timestamp: Date.now(),
        signers: [wallet.publicKey.toString(), ...signers.map(s => s.publicKey.toString())],
      };

      const updatedMemos = [newMemo, ...memos];
      saveMemos(updatedMemos);

      toast.success('Memo sent successfully!');
      console.log('Transaction signature:', tx);
    } catch (error) {
      console.error('Error sending memo:', error);
      toast.error('Failed to send memo: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMemos([]);
    localStorage.removeItem('solana-memos');
    toast.info('Memo history cleared');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {!wallet.connected ? (
        // Landing Page
        <div>
          {/* Header with Brand Name */}
          <header style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            padding: '20px 40px',
            zIndex: 10
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              MemoChain
            </div>
          </header>
          
          {/* Main Landing Content */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '0 20px'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'center',
              width: '100%'
            }}>
              {/* Left Content */}
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#667eea',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '20px'
                }}>
                  BLOCKCHAIN SIMPLIFIED
                </div>
                
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  lineHeight: '1.1',
                  margin: '0 0 30px 0',
                  color: '#1a1a1a'
                }}>
                  Store Messages{' '}
                  <span style={{ color: '#667eea' }}>On-Chain Forever</span>
                </h1>
                
                <p style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.6',
                  color: '#666',
                  marginBottom: '40px',
                  maxWidth: '500px'
                }}>
                  Memo dApp lets you store important messages, notes, and data 
                  directly on the blockchain. Immutable, secure, and accessible from 
                  anywhere in the world.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center'
                }}>
                  <WalletMultiButton style={{
                    background: '#667eea',
                    borderRadius: '8px',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} />
                  
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#667eea',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}>
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Right Content - Mock Phone/Card */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #e3e7fc 0%, #f0f2ff 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  width: '400px',
                  height: '500px',
                  position: 'relative',
                  boxShadow: '0 20px 40px rgba(102, 126, 234, 0.1)'
                }}>
                  {/* Chat Bubble Icon */}
                  <div style={{
                    position: 'absolute',
                    top: '60px',
                    right: '60px',
                    width: '60px',
                    height: '60px',
                    background: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    💬
                  </div>
                  
                  {/* Mock Message Card */}
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '120px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                      fontSize: '12px',
                      color: '#28a745'
                    }}>
                      🔒 Secured on blockchain
                    </div>
                    
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      Important meeting tomorrow at 2pm with the team to discuss project milestones.
                    </div>
                    
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>10 minutes ago</span>
                      <span style={{ color: '#667eea' }}>⚡</span>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '40px',
                    width: '8px',
                    height: '8px',
                    background: '#667eea',
                    borderRadius: '50%'
                  }}></div>
                  
                  <div style={{
                    position: 'absolute',
                    bottom: '60px',
                    right: '100px',
                    width: '4px',
                    height: '4px',
                    background: '#764ba2',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Connected App Interface
        <div>
          {/* Header with Brand Name for Connected State */}
          <header style={{
            padding: '20px 40px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'white'
              }}>
                MemoChain
              </div>
              <WalletMultiButton />
            </div>
          </header>
          
          <div className="container" style={{ paddingTop: '40px' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ color: '#764ba2', fontSize: '2.5rem', marginBottom: '10px' }}>
                🎯 Send Your Memo
              </h1>
              <p style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', fontSize: '1.1rem' }}>
                Store messages permanently on the Solana blockchain
              </p>
            </header>

            <div>
              <div className="card">
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Send Memo</h2>
                <MemoForm onSendMemo={sendMemo} loading={loading} />
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: '#333', margin: 0 }}>Memo History</h2>
                  {memos.length > 0 && (
                    <button className="btn btn-secondary" onClick={clearHistory}>
                      Clear History
                    </button>
                  )}
                </div>
                <MemoHistory memos={memos} />
              </div>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default MemoApp;