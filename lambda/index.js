// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
class GraphCrawler {

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
    
    isSlotType(){
        return (this.graph).nodes[(this.GraphNode)].isSlotType;
    }
    
    getSlotValue(){
        return (this.graph).nodes[(this.GraphNode)].slotValue;
    }
    
    getNode(){
        return (this.GraphNode);
    }

}


const Alexa = require('ask-sdk-core');
const { ConnectContactLens } = require('aws-sdk');
const DAG = require('./graph.json');
//const GraphCrawler = require('./GraphCrawler');
let firstTime = true;

//Global Graph Object for the User :
let Graph ;
let ucVar,bv; 

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        firstTime = true;
        const speakOutput = 'Welcome to Capital game, Its a demo skill for testing out the graph based traversals for user interaction, Say start it up to start the game';
        //Graph Object Instantiated: 
        Graph = new GraphCrawler(DAG);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};  


//GraphInterceptor object is a request interceptor and it runs before every intent request from User, irrespective of the intent
//The graph logic of going to the next node based on the user logic is implemented in this interceptor
const GraphInterceptor = {
    process(handlerInput){
        if( Alexa.getRequestType(handlerInput.requestEnvelope) !== 'IntentRequest'
        || Alexa.getIntentName(handlerInput.requestEnvelope) !== 'HelloToWorldIntent'
        || Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest') {return;}
        let req = Alexa.getRequest(handlerInput.requestEnvelope);
        //console.log("req: ",req);
        try{
            if(firstTime){
                firstTime = false;
                return;
            }
            let node = Graph.getNode();
            let userChoice = 'test';
            bv = node.isSlotType;
            console.log("bv :", Graph.isSlotType());
            console.log("slot Value is : ", Graph.getSlotValue());
            
            if(Graph.isSlotType() === true){
                console.log("the object is :", Alexa.getSlot(handlerInput.requestEnvelope, Graph.getSlotValue()));
                userChoice = Alexa.getSlot(handlerInput.requestEnvelope, Graph.getSlotValue()).name;
            }
            else{
                userChoice = Alexa.getSlotValue(handlerInput.requestEnvelope, Graph.getSlotValue());
            }
            //userChoice = Alexa.getSlot(handlerInput.requestEnvelope, "noValue").name;
            ucVar = userChoice;
            console.log('The user choice is : ', userChoice);
            Graph.next(userChoice);
            return; 
        }
        catch(error){
            console.log("the error is " ,error);
        }
    }
};


const IntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloToWorldIntent';
    },
    handle(handlerInput) {
        //if(GraphNode==undefined) GraphNode = graph.listOfNode[0];
        
        //This handler just goes to the Graph object that was instantiated with launch request and uses getReply()
        //Method to get the reply of current Graph node
        try{
            const speakOutPut = Graph.getReply();
            //if(firstTime){
                //firstTime = false;
                //let uc = Alexa.getSlotValue(handlerInput.requestEnvelope, "noValue");
              //  Graph.next(uc);
            //}

            return handlerInput.responseBuilder
            .speak(speakOutPut)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
        }
        catch(error){
            console.log("the error here in handler: " , error);
        }
    }
};
const HelloToWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloToWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'really good response!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        let check ;
        if(bv=== null) check = "its do do do null" ;
        else check = bv;
        const speakOutput = check;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        IntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(
        GraphInterceptor
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
