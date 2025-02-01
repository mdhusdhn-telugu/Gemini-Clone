import { createContext, useState, useEffect } from "react";
import run from "../Config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompt, setPreviousPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Load prompts from local storage when the component mounts
    useEffect(() => {
        const savedPrompts = localStorage.getItem("previousPrompts");
        if (savedPrompts) {
            setPreviousPrompt(JSON.parse(savedPrompts));
        }
    }, []);

    // Save prompts to local storage whenever previousPrompt changes
    useEffect(() => {
        localStorage.setItem("previousPrompts", JSON.stringify(previousPrompt));
    }, [previousPrompt]);

    const newChat = () => {
        console.log("Starting a new chat...");
        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setResultData("");
        setInput("");
    };

    const onSent = async (prompt) => {
        try {
            console.log("Sending prompt:", prompt);
            setResultData("");
            setLoading(true);
            setShowResult(true);

            let response;
            let newPrompt = prompt || input.trim();

            if (!newPrompt) {
                console.warn("Input is empty, not sending request.");
                setLoading(false);
                setShowResult(false);
                return;
            }

            response = await run(newPrompt);
            setRecentPrompt(newPrompt);

            // Save the prompt if it's new
            setPreviousPrompt(prev => {
                const updatedPrompts = [...prev, newPrompt];
                localStorage.setItem("previousPrompts", JSON.stringify(updatedPrompts)); // Save to localStorage
                return updatedPrompts;
            });

            if (!response) {
                throw new Error("No response received from AI.");
            }

            // Properly formatting the response
            let formattedResponse = response.replace(/\*/g, "<br/>"); // Converts '*' into line breaks
            setResultData(formattedResponse);

        } catch (error) {
            console.error("Error in onSent:", error);
            setShowResult(false);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        <Context.Provider value={{
            previousPrompt,
            setPreviousPrompt,
            onSent,
            setRecentPrompt,
            recentPrompt,
            showResult,
            loading,
            resultData,
            input,
            setInput,
            newChat,
        }}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
