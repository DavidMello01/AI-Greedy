// Definição do grafo
const graph = {
    Guarita: { Garagem: 3, RampaG: 7, Triangulo: 6 },
    Garagem: { Guarita: 3, RampaG: 1, Adm: 7 },
    RampaG: { Guarita: 7, Garagem: 1, Adm: 3, EntradaSalasG: 5 },
    Adm: { Garagem: 7, RampaG: 3, EntradaSalasG: 2, EscadaS: 6 },
    EntradaSalasG: { RampaG: 5, Adm: 2, EscadaS: 4 },
    EscadaS: { Adm: 6, EntradaSalasG: 4, BlocoE: 1, BlocoF: 1, BlocoB: 4, BlocoD: 3 },
    BlocoE: { EscadaS: 1, BlocoC: 3, EntradaP: 5, BlocoA: 7, EscadaP: 6 },
    BlocoC: { BlocoE: 3, BlocoA: 5, EscadaS: 2, EscadaP: 4 },
    BlocoA: { BlocoC: 5, BlocoE: 7, EscadaP: 1, MiniAuditorio: 2 },
    EscadaP: { BlocoE: 6, BlocoA: 1, BlocoC: 4, BlocoB: 3, BlocoD: 4, BlocoF: 6, Pedagogico: 2, Triangulo: 6 },
    BlocoB: { EscadaP: 3, BlocoD: 1, BlocoF: 5, EscadaS: 4 },
    BlocoD: { BlocoB: 1, BlocoF: 2, EscadaP: 4, EscadaS: 3 },
    BlocoF: { BlocoB: 5, BlocoD: 2, EscadaP: 6, EscadaS: 1 },
    Pedagogico: { EscadaP: 2, Triangulo: 4 },
    Triangulo: { Pedagogico: 4, Biblioteca: 3, Refeitorio: 2, Ginasio: 5, Guarita: 6 },
    Biblioteca: { Pedagogico: 2, Triangulo: 3, Refeitorio: 1, Ginasio: 4, LaboratoriosEletro: 2, Auditorio: 2 },
    Refeitorio: { Ginasio: 3, Biblioteca: 1, Triangulo: 2 },
    LaboratoriosEletro: { EntradaP: 2, Auditorio: 1 },
    Auditorio: { LaboratoriosEletro: 1, Biblioteca: 2, Pedagogico: 3, MiniAuditorio: 2 },
    MiniAuditorio: { BlocoA: 3, Auditorio: 1 },
    Ginasio: { Triangulo: 5, Biblioteca: 4, Refeitorio: 3 },
};

// Posições dos nós no SVG (x, y)
const positions = {
    Guarita: { x: 450, y: 100 },
    Garagem: { x: 220, y: 200 },
    RampaG: { x: 400, y: 300 },
    Adm: { x: 240, y: 400 },
    EntradaSalasG: { x: 350, y: 450 },
    EscadaS: { x: 249, y: 600 }, // Posição central para a escada
    BlocoE: { x: 580, y: 200 },
    BlocoC: { x: 670, y: 300 },
    BlocoA: { x: 690, y: 400 },
    EscadaP: { x: 650, y: 500 }, // Posição central para a escada
    BlocoB: { x: 700, y: 600 },
    BlocoD: { x: 650, y: 700 },
    BlocoF: { x: 420, y: 800 },
    Pedagogico: { x: 970, y: 500 },
    Triangulo: { x: 880, y: 600 },
    Biblioteca: { x: 1050, y: 700 },
    Refeitorio: { x: 800, y: 800 },
    Ginasio: { x: 880, y: 900 },
    LaboratoriosEletro: { x: 1250, y: 600 },
    Auditorio: { x: 1280, y: 700 },
    MiniAuditorio: { x: 1300, y: 400 },
};

// Variáveis para armazenar os elementos da interface
const startSelect = document.getElementById('start');
const endSelect = document.getElementById('end');
const searchBtn = document.getElementById('searchBtn');
const logDiv = document.getElementById('log');
const svgGraph = document.getElementById('svgGraph');

// Verificar posições faltantes
const missingPositions = [];
for (const node in graph) {
    if (!positions[node]) {
        missingPositions.push(node);
    }
}
if (missingPositions.length > 0) {
    console.warn(`Faltando posições para os nós: ${missingPositions.join(', ')}`);
}

// Inicializar as opções de seleção
function initializeOptions() {
    const nodes = Object.keys(graph);
    // Limpar opções anteriores
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    nodes.forEach(node => {
        const option1 = document.createElement('option');
        option1.value = node;
        option1.text = node;
        startSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = node;
        option2.text = node;
        endSelect.appendChild(option2);
    });
}

// Função para desenhar o grafo usando SVG
function drawGraph() {
    // Limpar grafo anterior
    svgGraph.innerHTML = '';

    // Desenhar arestas
    for (let node in graph) {
        for (let neighbor in graph[node]) {
            if (node < neighbor) { // Evitar desenhar duas vezes
                // Verificar se o nó e o vizinho existem nas posições
                if (positions[node] && positions[neighbor]) {
                    const x1 = positions[node].x;
                    const y1 = positions[node].y;
                    const x2 = positions[neighbor].x;
                    const y2 = positions[neighbor].y;

                    // Desenhar linha da aresta
                    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    edge.setAttribute('x1', x1);
                    edge.setAttribute('y1', y1);
                    edge.setAttribute('x2', x2);
                    edge.setAttribute('y2', y2);
                    edge.setAttribute('class', 'edge');
                    edge.setAttribute('data-from', node);
                    edge.setAttribute('data-to', neighbor);
                    svgGraph.appendChild(edge);

                    // Calcular posição para o peso (meio da aresta)
                    const weightX = (x1 + x2) / 2;
                    const weightY = (y1 + y2) / 2;

                    // Desenhar peso da aresta
                    const weight = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    weight.setAttribute('class', 'edge weight');
                    weight.setAttribute('x', weightX);
                    weight.setAttribute('y', weightY);
                    weight.textContent = graph[node][neighbor];
                    svgGraph.appendChild(weight);
                }
            }
        }
    }

    // Desenhar nós
    for (let node in positions) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'node');
        circle.setAttribute('cx', positions[node].x);
        circle.setAttribute('cy', positions[node].y);
        circle.setAttribute('r', 20);
        circle.setAttribute('fill', '#555');
        circle.setAttribute('data-node', node);
        svgGraph.appendChild(circle);

        // Desenhar texto do nó
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', positions[node].x);
        text.setAttribute('y', positions[node].y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#f0f0f0');
        text.textContent = node;
        svgGraph.appendChild(text);
    }
}


// Função para executar a busca gulosa
async function greedySearch(start, end) {
    const visited = new Set(); // Conjunto de nós visitados
    const queue = [{ node: start, path: [start], cost: 0 }]; // Fila de busca

    while (queue.length > 0) {
        // Ordenar a fila com base na heurística (custo + heurística)
        queue.sort((a, b) => (a.cost + heuristic(a.node, end)) - (b.cost + heuristic(b.node, end)));
        const current = queue.shift();
        visited.add(current.node);

        // Log da execução
        logDiv.innerHTML += `Visitando: ${current.node}<br>`;
        
        // Destacar o nó visitado
        highlightNode(current.node);

        // Se atingiu o nó final, desenhar o caminho
        if (current.node === end) {
            await drawPath(current.path); // Desenhar o caminho final
            return current.path; // Retornar o caminho encontrado
        }

        // Explorar vizinhos
        for (const neighbor in graph[current.node]) {
            if (!visited.has(neighbor)) {
                const newPath = [...current.path, neighbor];
                const newCost = current.cost + graph[current.node][neighbor];
                queue.push({ node: neighbor, path: newPath, cost: newCost });
            }
        }
    }

    return null;
}
// Função para desenhar o caminho final
async function drawPath(path) {
    for (let i = 0; i < path.length - 1; i++) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar meio segundo
        const from = path[i];
        const to = path[i + 1];
        const x1 = positions[from].x;
        const y1 = positions[from].y;
        const x2 = positions[to].x;
        const y2 = positions[to].y;

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        pathElement.setAttribute('class', 'path');
        pathElement.setAttribute('x1', x1);
        pathElement.setAttribute('y1', y1);
        pathElement.setAttribute('x2', x2);
        pathElement.setAttribute('y2', y2);
        pathElement.setAttribute('stroke', 'red');
        pathElement.setAttribute('stroke-width', '4');
        svgGraph.appendChild(pathElement);
    }
}
function heuristic(node, end) {
    // 
    return 0;
}

// Função para destacar o nó
function highlightNode(node) {
    const nodeElements = svgGraph.querySelectorAll('.node');
    nodeElements.forEach((element) => {
        if (element.getAttribute('data-node') === node) {
            element.setAttribute('fill', 'orange'); // Destacar nó atual
        } else {
            element.setAttribute('fill', '#555'); // Reiniciar outros nós
        }
    });
}



// Adicionar listener ao botão de busca
document.addEventListener('DOMContentLoaded', () => {
    // Coloque todo o seu código aqui
    initializeOptions();
    drawGraph();

    // Adicionar listener ao botão de busca
    searchBtn.addEventListener('click', () => {
        const startNode = startSelect.value;
        const endNode = endSelect.value;

        if (startNode && endNode) {
            greedySearch(startNode, endNode);
        } else {
            logDiv.textContent = 'Por favor, selecione um nó de início e um nó de destino.';
        }
    });
});



initializeOptions();
drawGraph();
