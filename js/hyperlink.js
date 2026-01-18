
    // Create animated background particles
    function createParticles() {
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');
        
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = '100vh';
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        particle.style.opacity = Math.random() * 0.2;
        
        document.body.appendChild(particle);
      }
    }
    
    // Mouse movement parallax effect
    document.addEventListener('mousemove', (e) => {
      const container = document.getElementById('container');
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Reset position when mouse leaves
    document.addEventListener('mouseleave', () => {
      const container = document.getElementById('container');
      container.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
    
    async function shortenUrl(longUrl) {
      if (!longUrl) return longUrl;
      
      // Ensure URL has proper protocol
      if (!longUrl.match(/^https?:\/\//)) {
        longUrl = 'https://' + longUrl;
      }
      
      try {
        // First try with JSON API
        const jsonResponse = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
        
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.json();
          
          // Check for API errors in JSON response
          if (jsonData.errorcode) {
            throw new Error(jsonData.errormessage || 'API error');
          }
          
          if (jsonData.shorturl && jsonData.shorturl.startsWith('http')) {
            return jsonData.shorturl;
          }
        }
        
        // If JSON fails, try simple format as fallback
        const simpleResponse = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`);
        
        if (simpleResponse.ok) {
          const simpleUrl = await simpleResponse.text();
          
          // Validate simple response
          if (simpleUrl.startsWith('http')) {
            return simpleUrl;
          } else if (simpleUrl.startsWith('Error:')) {
            throw new Error(simpleUrl);
          }
        }
        
        throw new Error('No valid response from API');
        
      } catch (error) {
        console.error('URL shortening failed:', error);
        return longUrl; // Return original if shortening fails
      }
    }
    
    async function generateLink() {
      const url = document.getElementById('url').value.trim();
      if (!url) {
        alert('Please enter a URL');
        return;
      }
      
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '<p>Shortening URL...</p>';
      outputDiv.style.opacity = '0';
      outputDiv.style.transform = 'translateY(20px)';
      
      try {
        const shortUrl = await shortenUrl(url);
        const format = document.getElementById('format').value;
        
        let prefix;
        switch(format) {
          case 'profile':
            prefix = '[https__:__//www.roblox.com/users/6700452/profile]';
            break;
          case 'private-server':
            prefix = '[https_:_//www.roblox.com/share?code=9b3bf13e5fe0894d941ac87ac52f8d1d&type=Server]';
            break;
          case 'group':
            prefix = '[https__:__//www.roblox.com/groups/7429401045]';
            break;
          default:
            prefix = '[Link]';
        }
        
        const formattedLink = `${prefix}(${shortUrl})`;
        
        setTimeout(() => {
          outputDiv.style.opacity = '1';
          outputDiv.style.transform = 'translateY(0)';
          outputDiv.innerHTML = `
            <p><strong>Your Discord Hyperlink:</strong></p>
            <p style="word-break: break-all;">${formattedLink}</p>
            <p><small>Copied to clipboard!</small></p>
          `;
        }, 300);
        
        try {
          await navigator.clipboard.writeText(formattedLink);
        } catch (err) {
          console.error('Failed to copy:', err);
          outputDiv.innerHTML += `<p><small>Please copy manually</small></p>`;
        }
      } catch (error) {
        outputDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        outputDiv.style.opacity = '1';
        outputDiv.style.transform = 'translateY(0)';
      }
    }
    
    // Initialize everything
    createParticles();
    
    // Auto-focus URL input on load
    document.getElementById('url').focus();