let quoteHeading = document.querySelector(".quote");

function displayQuotes() {
    let quotes = [
        "Empower your voice, shape the nation. Your vote counts in building the future of Pakistan.",
        "Democracy thrives when citizens engage. Get ready to make a difference in the upcoming elections.",
        "Elections are the heartbeat of democracy. Stand up, be heard, and let your vote resonate for a brighter Pakistan.",
        "Every vote is a step towards progress. Join hands to chart the course for a prosperous and united Pakistan.",
        "In the dance of democracy, you are the lead. Cast your vote and be part of the rhythm that defines our nation.",
        "Your choice, your voice. Be the architect of change in the upcoming elections for a stronger Pakistan.",
        "Unveil the power of your vote. Shape the destiny of Pakistan through active participation in the democratic process.",
        "Stand tall, stand proud. Your vote is the key to a Pakistan that reflects your values and aspirations.",
        "Election day is more than a vote; it's a commitment to the progress of Pakistan. Be part of the change.",
        "Let your ballot be the compass guiding Pakistan towards a brighter future.",
        "Democracy is a symphony, and your vote is the melody that shapes it.",
        "Vote not just for a candidate, but for the Pakistan you believe in.",
        "In the tapestry of democracy, your vote is a vibrant thread of change.",
        "Elections are the canvas; your vote paints the portrait of our nation.",
        "Raise your voice, cast your vote – be the author of Pakistan's destiny.",
        "United we vote, divided we fall. Stand together for a stronger Pakistan.",
        "Your vote, your legacy. Contribute to the history of a thriving Pakistan.",
        "Vote with conviction, for a Pakistan that stands tall on the world stage.",
        "Democracy is not a spectator sport. Get in the game, make your mark in the upcoming elections."
    ];
    let rand = Math.ceil(Math.random() * quotes.length) - 1;
    return quotes[rand];
}

quoteHeading.innerText = displayQuotes();