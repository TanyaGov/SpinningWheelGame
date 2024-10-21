document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("wheel");
    const ctx = canvas.getContext("2d");
    const spinButton = document.getElementById("spinButton");
    const winAmountInput = document.getElementById("winAmount");

    let isSpinning = false;
    let startAngle = 0;

    const segments = [
        { minDegree: 0, maxDegree: 18, color: "purple", prize: 5 },
        { minDegree: 18, maxDegree: 36, color: "green", prize: 0 },
        { minDegree: 36, maxDegree: 54, color: "blue", prize: 2 },
        { minDegree: 54, maxDegree: 72, color: "green", prize: 0 },
        { minDegree: 72, maxDegree: 90, color: "yellow", prize: 10 },
        { minDegree: 90, maxDegree: 108, color: "green", prize: 0 },
        { minDegree: 108, maxDegree: 126, color: "blue", prize: 2 },
        { minDegree: 126, maxDegree: 144, color: "green", prize: 0 },
        { minDegree: 144, maxDegree: 162, color: "purple", prize: 5 },
        { minDegree: 162, maxDegree: 180, color: "green", prize: 0 },
        { minDegree: 180, maxDegree: 198, color: "red", prize: 100 },
        { minDegree: 198, maxDegree: 216, color: "green", prize: 0 },
        { minDegree: 216, maxDegree: 234, color: "purple", prize: 5 },
        { minDegree: 234, maxDegree: 252, color: "green", prize: 0 },
        { minDegree: 252, maxDegree: 270, color: "blue", prize: 2 },
        { minDegree: 270, maxDegree: 288, color: "green", prize: 0 },
        { minDegree: 288, maxDegree: 306, color: "yellow", prize: 10 },
        { minDegree: 306, maxDegree: 324, color: "green", prize: 0 },
        { minDegree: 324, maxDegree: 342, color: "blue", prize: 2 },
        { minDegree: 342, maxDegree: 360, color: "green", prize: 0 },
    ];

    const segmentAngle = 18;
    let spinTime = 0;

    const tickSound = new Howl({
        src: ['Tick.wav'],
        volume: 0.5
    });

    const wheelImage = new Image();
    wheelImage.src = 'Wheel_Test.png';
    wheelImage.onload = function () {
        drawWheel();
    };

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); 
        ctx.rotate(startAngle);
        const imageRotation = 9 * (Math.PI / 180); 
        ctx.rotate(imageRotation);
    
        ctx.drawImage(wheelImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2); 
        ctx.rotate(startAngle);
    
        for (let i = 0; i < segments.length; i++) {
            const angle = i * segmentAngle * (Math.PI / 180);
            ctx.save();
            ctx.rotate(angle + (segmentAngle / 2) * (Math.PI / 180));
            ctx.translate(0, -canvas.width / 2.5);
    
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(segments[i].prize, 0, 0); 
            ctx.restore();
        }
    
        ctx.restore();
    
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 10);
        ctx.lineTo(canvas.width / 2 - 15, 40);
        ctx.lineTo(canvas.width / 2 + 15, 40);
        ctx.closePath();
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    }
    
    function spin() {
        if (isSpinning) return;

        const winAmount = parseInt(winAmountInput.value);
        if (isNaN(winAmount) || winAmount <= 0) {
            alert("Please enter a valid win amount.");
            return;
        }

        spinButton.disabled = true;
        winAmountInput.disabled = true;
        winLabel.innerHTML = "S P I N N I N G ...";
        winLabel.style.color = "white"; 

        isSpinning = true;
        spinTime = Math.random() * 3000 + 2000; 
        spinAnimation();
    }

    function spinAnimation() {
        if (spinTime > 0) {
            startAngle += (2 * Math.PI) / 30; 
            spinTime -= 1000 / 60; 

            tickSound.play(); 
            drawWheel(); 
            requestAnimationFrame(spinAnimation);
        } else {
            isSpinning = false;
            const finalSpinAngle = (startAngle * (180 / Math.PI)) % 360; 
            calculatePrize(finalSpinAngle);

            spinButton.disabled = false;
            winAmountInput.disabled = false;
        }
    }

    const winSound = new Howl({
        src: ['winSound.mp3'],
        volume: 0.5
    });

    function calculatePrize(finalSpinAngle) {
        const adjustedAngle = (360 - finalSpinAngle) % 360; 
        const selectedSegment = segments.find(segment => {
            return adjustedAngle >= segment.minDegree && adjustedAngle < segment.maxDegree;});
        
        if (selectedSegment) {
            const winAmount = parseInt(winAmountInput.value);
            if (selectedSegment.prize <= 0){
                winLabel.innerHTML = `TRY AGAIN<br>You won: ${winAmount * selectedSegment.prize}`;
                winLabel.style.color = "#ff3333";
            }
            else{
                winSound.play();
                winLabel.innerHTML = `WINNER<br>You won: ${winAmount * selectedSegment.prize}`;
                winLabel.style.color = "#DBA514";
            }
           
        } else {
            alert("No segment found.");
        }
    }
    spinButton.addEventListener("click", spin);
});
