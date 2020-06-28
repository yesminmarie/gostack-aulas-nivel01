import React, { useState, useEffect } from 'react';
import api from './services/api';

import './App.css';

import Header from './components/Header';

function App() {

    // useState retorna um array com 2 posições
    // 1. Variável com o seu valor inicial
    // 2. Função para atualizarmos esse valor

    const [projects, setProjects] = useState([]);

    //useEffect recebe dois parâmetros:
    //o primeiro é qual função quer disparar
    //o segundo é quando quer disparar essa função, colocando dentro do array a variável que,
    //quando for alterada, irá disparar a função. Se deixar o array vazio, a função é
    //executada apenas uma vez, somente quando o componente for exibido em tela
    useEffect(() => {
        api.get('projects').then(response => {
            setProjects(response.data)
        });
    }, []);

    async function handleAddProject() {

        //copia o valor da variável projects, adiciona novas informações,
        //alterando de forma indireta o valor da variável projects
        //setProjects([...projects, `Novo projeto ${Date.now()}`]);
        const response = await api.post('projects', {
            title: `Novo projeto ${Date.now()}`,
            owner: "Yesmin Marie"
        })

        const project = response.data;

        setProjects([...projects, project])
    }
    return (
        <>
            <Header title="Projects" />

            <ul>
                {projects.map(project => <li key={project.id}>{project.title}</li>)}
            </ul>

            <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
        </>
    );
}

export default App;