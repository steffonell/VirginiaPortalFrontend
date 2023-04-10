import { useState, useEffect, useRef } from "react";
import ArticleDataService from "../services/ArticleService";

const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const articlesRef = useRef();

    articlesRef.current = articles;

    useEffect(() => {
        retrieveArticles();
    }, []);

    const retrieveArticles = () => {
        ArticleDataService.getAll()
            .then((response) => {
                setArticles(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return {
        articles,
        articlesRef,
        retrieveArticles,
    };
};

export default useArticles;