/*
	#stateHandling.js#
*/
const messageStates = new Map();

module.exports = {

    createState: function(data, msg) {

        const state = {
    
            data: data,
            currentIndex: 0,
            message: msg,
            hits: data?.length ?? 0,
            author: null,
    
        };
    
        messageStates.set(state.message.id, state);

        setTimeout(() => {

            console.log(`Attemping to time out ${state.message.id}`)
            if(this.has(state.message.id)) this.deleteState(state.message.id);

        }, 600000);
        
        return state;
    
    },

    replaceState: function(originalMessageID) {

        let tempState = messageStates.get(originalMessageID);
        messageStates.set(tempState.message.id, tempState);
        messageStates.delete(originalMessageID);
    
        return tempState;
    
    },

    has: function(messageID) {

        return messageStates.has(messageID);

    },

    get: function(messageID) {

        return messageStates.get(messageID);

    },

    deleteState: function(messageID) {

        if(!messageStates.has(messageID)) {
            
            console.log(`Attempt to delete ${messageID} failed. Message no longer exists.`);
            return;

        }
    
        console.log(`${messageID} was timed out or closed.`);
        messageStates.delete(messageID);
    
    }

}



