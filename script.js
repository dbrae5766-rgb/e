// script.js

// Select DOM elements
const startButton = document.getElementById('startButton');
const speedDisplay = document.getElementById('speed');
const statusText = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const pingResult = document.getElementById('ping');
const downloadResult = document.getElementById('download');
const uploadResult = document.getElementById('upload');

// Helper function to create a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to animate the speed test phase
async function runTestPhase(duration, targetSpeed, progressStart, progressEnd) {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                clearInterval(interval);
                progressBar.style.width = `${progressEnd}%`;
                speedDisplay.innerText = targetSpeed.toFixed(1);
                resolve(targetSpeed.toFixed(1));
                return;
            }

            // Simulate realistic speed fluctuations:
            // Math.pow(progress, 0.2) makes the speed jump up quickly at the start
            // (0.85 + Math.random() * 0.3) adds a +/- 15% random jitter to the current speed
            let currentSpeed = targetSpeed * Math.pow(progress, 0.2) * (0.85 + Math.random() * 0.3);
            
            // Prevent going way over the target visually due to jitter
            if (currentSpeed > targetSpeed * 1.1) {
                currentSpeed = targetSpeed * 1.05;
            }

            speedDisplay.innerText = currentSpeed.toFixed(1);
            
            // Update progress bar
            const currentProgress = progressStart + ((progressEnd - progressStart) * progress);
            progressBar.style.width = `${currentProgress}%`;

        }, 50); // Update every 50ms for smooth animation
    });
}

// Main Speed Test function
async function startSpeedTest() {
    // 1. Lock UI & Reset values
    startButton.disabled = true;
    startButton.innerText = "Testing...";
    startButton.style.opacity = "0.5";
    startButton.style.cursor = "not-allowed";
    
    speedDisplay.innerText = "0";
    progressBar.style.width = "0%";
    pingResult.innerText = "--";
    downloadResult.innerText = "--";
    uploadResult.innerText = "--";

    // Randomize some fake targets for the simulation
    const targetPing = Math.floor(Math.random() * 20) + 5; // 5 - 25 ms
    const targetDownload = Math.floor(Math.random() * 500) + 200; // 200 - 700 Mbps
    const targetUpload = Math.floor(Math.random() * 200) + 50; // 50 - 250 Mbps

    try {
        // --- PHASE 1: PING ---
        statusText.innerText = "Connecting & Testing Ping...";
        await sleep(800); // Fake connection delay
        pingResult.innerText = `${targetPing} ms`;
        progressBar.style.width = "10%";

        // --- PHASE 2: DOWNLOAD ---
        statusText.innerText = "Testing Download Speed...";
        await sleep(400); 
        // Run for 3 seconds, progress from 10% to 55%
        const finalDownload = await runTestPhase(3000, targetDownload, 10, 55);
        downloadResult.innerText = finalDownload;
        
        // Reset center speed for upload
        speedDisplay.innerText = "0";
        await sleep(500);

        // --- PHASE 3: UPLOAD ---
        statusText.innerText = "Testing Upload Speed...";
        // Run for 3 seconds, progress from 55% to 100%
        const finalUpload = await runTestPhase(3000, targetUpload, 55, 100);
        uploadResult.innerText = finalUpload;

        // --- PHASE 4: COMPLETE ---
        statusText.innerText = "Test Complete!";
        speedDisplay.innerText = "0";
        
    } catch (error) {
        statusText.innerText = "An error occurred.";
        console.error(error);
    } finally {
        // Unlock UI
        startButton.disabled = false;
        startButton.innerText = "Restart Test";
        startButton.style.opacity = "1";
        startButton.style.cursor = "pointer";
    }
}

// Event Listener
startButton.addEventListener('click', startSpeedTest);