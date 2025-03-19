import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvaluations } from '../../hooks/useEvaluations';
import { fetchUserEmail } from '../../services/userService';

const Comments: React.FC = () => {
  const { dailyData, addComment } = useEvaluations();
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});

  // Função para carregar os e-mails dos usuários
  useEffect(() => {
    const loadEmails = async () => {
      if (!dailyData?.comments) return;

      const emailsMap: { [key: string]: string } = { ...userEmails };

      // Buscar e-mails para cada comentário
      for (const comment of dailyData.comments) {
        if (!emailsMap[comment.userId]) {
          const email = await fetchUserEmail(comment.userId);
          emailsMap[comment.userId] = email;
        }
      }

      setUserEmails(emailsMap);
    };

    loadEmails();
  }, [dailyData]);

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
              {/* Aqui exibe o e-mail em vez do userId */}
              <strong>{userEmails[comment.userId] || 'Carregando...'}:</strong> {comment.text}
            </p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
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
