export class GraphCrawler {

    constructor(graph){
        this.graph = graph;
        this.GraphNode = graph.listOfNode[0];
    }

    next(userChoice){
        let nodes = this.graph.nodes;
        this.GraphNode = nodes[(this.GraphNode)].children[userChoice];
    }

    getReply(){
        return (this.graph).nodes[(this.GraphNode)].reply;
    }

}

