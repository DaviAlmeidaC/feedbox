// src/components/Dashboard/Comments.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvaluations } from '../../hooks/useEvaluations';

const Comments: React.FC = () => {
  const { dailyData, addComment } = useEvaluations();
  const { currentUser } = useAuth();
  const [text, setText] = useState('');

  if (!dailyData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!text.trim()) return;
    await addComment(currentUser.uid, text.trim());
    setText('');
  };

  return (
    <div className="comments-box">
      <h3>Comentários do Dia</h3>
      <ul>
        {dailyData.comments?.map((comment, idx) => (
          <li key={idx} style={{ marginBottom: '10px' }}>
            <p>
              <strong>{comment.userId}:</strong> {comment.text}
            </p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
            {/* Aqui poderia exibir replies se quiser */}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Adicionar comentário"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '80%', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px', marginLeft: '5px' }}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Comments;
