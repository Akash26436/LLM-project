from app.services.llm_service import get_llm, generate_with_retry
from app.agents.retriever_agent import RetrieverAgent

class DoubtAgent:
    """
    DoubtAgent uses the RetrieverAgent to fetch context from course materials 
    (stored in Pinecone) and answers student doubts 24/7.
    """
    def __init__(self):
        self.llm = get_llm("gemini-2.5-flash")
        self.retriever = RetrieverAgent()

    def answer_query(self, query: str, course_topic: str = None) -> str:
        """
        Retrieves relevant context and answers the query.
        """
        # Retrieve context
        results = self.retriever.query(query_text=query, top_k=3, topic_filter=course_topic)
        docs = results.get("documents", [])
        
        context = ""
        if docs and docs[0]:
            context_list = [chunk for sublist in docs for chunk in (sublist if isinstance(sublist, list) else [sublist])]
            context = "\n\n".join(context_list)

        if not context:
            prompt = f"Provide a helpful answer to this student's question: {query}"
        else:
            prompt = f"""
            You are a helpful 24/7 Doubt-Solving Assistant for an Agentic Classroom.
            Use the provided course material context to answer the student's question.
            If the context does not contain the answer, use your general knowledge but mention 
            that it's not directly in the course materials.

            COURSE CONTEXT:
            {context}

            STUDENT QUESTION:
            {query}
            """

        try:
            return generate_with_retry(self.llm, prompt)
        except Exception as e:
            return f"Error generating answer: {e}"
