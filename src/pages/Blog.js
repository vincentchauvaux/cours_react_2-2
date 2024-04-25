import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import axios from "axios";
import Article from "../components/Article";


const Blog = () => {
    const [blogData,setBlogData] = useState([]);
    const [author, setAuthor] = useState ("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(false);

    const getData = () => {
        axios
            .get("http://localhost:3004/articles")
            .then((res)=>setBlogData(res.data));
    };

    useEffect (()=> getData(),[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.length < 20) {
            setError(true);
        }else{
            // Trouver le plus grand ID dans blogData et l'incrémenter pour le nouvel article
            const newId = blogData.reduce((max, article) => Math.max(max, parseInt(article.id)), 0) + 1;
            axios.post("http://localhost:3004/articles",{
                id: newId.toString(), // Assurez-vous que l'ID est une chaîne si vos autres ID sont des chaînes
                author,
                content,
                date: Date.now(),
                
            })
            setError(false);
            setAuthor("");
            setContent("");
            getData();
            window.location.reload();
        }
    };

    return (
        <div className="blog-container">
            <Logo />
            <Navigation />
            <h1>Blog</h1>

            <form onSubmit={(e) => handleSubmit(e)}>
                <input type="text" placeholder="Nom" onChange={(e) =>setAuthor(e.target.value)} value={author}/>
                <textarea style={{border:error ? "1px solid red" : "1px solid #61dafd"}} placeholder="Message" onChange={(e) => setContent(e.target.value)} value={content}></textarea>
                {error && <p>Veuillez écrire un minimum de 20 caractères</p>}
                <input type="submit" value="Envoyer" />
            </form>
            <ul>
                {blogData

                .sort((a,b)=>b.date-a.date)
                .map((article)=>(
                    <Article key={article.id} article={article}/>
                ))}
            </ul>
        </div>
    );
};

export default Blog;

