import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Agora a importação está correta

export const fetchUserEmail = async (userId: string): Promise<string> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().email; // Retorna o e-mail do usuário
    } else {
      return "Usuário desconhecido";
    }
  } catch (error) {
    console.error("Erro ao buscar e-mail do usuário:", error);
    return "Erro ao carregar";
  }
};
