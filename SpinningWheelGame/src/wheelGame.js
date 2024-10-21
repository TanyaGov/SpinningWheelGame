document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const spinButton = document.getElementById("spinButton");
    const winAmountInput = document.getElementById("winAmount");

    let isSpinning = false;
    let startAngle = 0;

    // Define the 20 segments with corresponding colors and prize values
    const segments = [
        { minDegree: 0, maxDegree: 18, color: "purple", prize: 250 },
        { minDegree: 18, maxDegree: 36, color: "green", prize: 100 },
        { minDegree: 36, maxDegree: 54, color: "blue", prize: 200 },
        { minDegree: 54, maxDegree: 72, color: "green", prize: 100 },
        { minDegree: 72, maxDegree: 90, color: "yellow", prize: 500 },
        { minDegree: 90, maxDegree: 108, color: "green", prize: 100 },
        { minDegree: 108, maxDegree: 126, color: "blue", prize: 200 },
        { minDegree: 126, maxDegree: 144, color: "green", prize: 100 },
        { minDegree: 144, maxDegree: 162, color: "purple", prize: 250 },
        { minDegree: 162, maxDegree: 180, color: "green", prize: 100 },
        { minDegree: 180, maxDegree: 198, color: "red", prize: 1000 },
        { minDegree: 198, maxDegree: 216, color: "green", prize: 100 },
        { minDegree: 216, maxDegree: 234, color: "purple", prize: 250 },
        { minDegree: 234, maxDegree: 252, color: "green", prize: 100 },
        { minDegree: 252, maxDegree: 270, color: "blue", prize: 200 },
        { minDegree: 270, maxDegree: 288, color: "green", prize: 100 },
        { minDegree: 288, maxDegree: 306, color: "yellow", prize: 500 },
        { minDegree: 306, maxDegree: 324, color: "green", prize: 100 },
        { minDegree: 324, maxDegree: 342, color: "blue", prize: 200 },
        { minDegree: 342, maxDegree: 360, color: "green", prize: 100 },
    ];

    const segmentAngle = 18; // Angle for each segment in degrees
    let spinTime = 0;

    // Load the tick sound
    const tickSound = new Howl({
        src: ['Tick.wav'],
        volume: 0.5
    });

    // Load the wheel image
    const wheelImage = new Image();
    wheelImage.src = 'Wheel_Test.png';
    wheelImage.onload = function () {
        drawWheel();
    };

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center of canvas
        ctx.rotate(startAngle); // Rotate for spinning
    
        // Rotate the image itself by 9 degrees (in radians)
        const imageRotation = 9 * (Math.PI / 180); // Convert degrees to radians
        ctx.rotate(imageRotation); // Apply image rotation
    
        // Draw the wheel image
        ctx.drawImage(wheelImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        
        // Restore context to remove image rotation
        ctx.restore();
    
        // Draw the prize text for each segment
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center of canvas
        ctx.rotate(startAngle); // Rotate for spinning
    
        for (let i = 0; i < segments.length; i++) {
            const angle = i * segmentAngle * (Math.PI / 180); // Convert angle to radians
            ctx.save();
            ctx.rotate(angle + (segmentAngle / 2) * (Math.PI / 180)); // Rotate to the middle of each segment
            ctx.translate(0, -canvas.width / 2.5); // Move out from the center
    
            // Draw the win amount text
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(segments[i].prize, 0, 0); // Text is placed at the calculated position
    
            ctx.restore(); // Reset canvas rotation
        }
    
        ctx.restore();
    
        // Draw the arrow at the top of the wheel
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 10);
        ctx.lineTo(canvas.width / 2 - 15, 40);
        ctx.lineTo(canvas.width / 2 + 15, 40);
        ctx.closePath();
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    }
    
    // Function to handle the spin
    function spin() {
        if (isSpinning) return;

        const winAmount = parseInt(winAmountInput.value);
        if (isNaN(winAmount) || winAmount <= 0) {
            alert("Please enter a valid win amount.");
            return;
        }

        isSpinning = true;
        spinTime = Math.random() * 3000 + 3000; // Random spin time between 3 and 6 seconds
        spinAnimation();
    }

    // Function to animate the spinning of the wheel
    function spinAnimation() {
        if (spinTime > 0) {
            startAngle += (2 * Math.PI) / 30; // Speed of rotation
            spinTime -= 1000 / 60; // Decrease spin time

            tickSound.play(); // Play tick sound
            drawWheel(); // Redraw the wheel during spinning
            requestAnimationFrame(spinAnimation);
        } else {
            isSpinning = false;
            // Add a final angle calculation based on the current spin to get the actual ending angle
            const finalSpinAngle = (startAngle * (180 / Math.PI)) % 360; // Convert radians to degrees
            calculatePrize(finalSpinAngle);
        }
    }

    // Function to calculate the prize
    function calculatePrize(finalSpinAngle) {
        // Adjust finalSpinAngle to account for the fact that the wheel spins counter-clockwise
        const adjustedAngle = (360 - finalSpinAngle) % 360; // Reverse the angle for counter-clockwise rotation

        // Calculate which segment the wheel landed on
        const selectedSegment = segments.find(segment => {
            return adjustedAngle >= segment.minDegree && adjustedAngle < segment.maxDegree;
        });
        
        if (selectedSegment) {
            alert(`You won: ${selectedSegment.prize}`);
        } else {
            alert("No segment found.");
        }
    }

    spinButton.addEventListener("click", spin);
});
