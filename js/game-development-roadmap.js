document.addEventListener('DOMContentLoaded', () => {
    loadRoadmap();
});

async function loadRoadmap() {
    const container = document.getElementById('roadmap-content');
    
    try {
        const response = await fetch('../data/roadmaps.json');
        if (!response.ok) throw new Error('Failed to fetch roadmap data');
        
        const data = await response.json();
        // Access the game-dev-roadmap key specifically
        const roadmapData = data['game-dev-roadmap'];
        const phases = roadmapData.phases;

        container.innerHTML = ''; // Clear loading state

        let globalModuleIndex = 0; // To track left/right alternation across phases

        phases.forEach(phase => {
            // 1. Create Phase Section
            const phaseBlock = document.createElement('div');
            phaseBlock.className = 'phase-block';

            // 2. Create Header (e.g., 1. THE ARCADE CORE)
            const header = document.createElement('div');
            header.className = 'phase-header';
            header.innerText = phase.title;
            phaseBlock.appendChild(header);

            // 2.5 Create Description (Specific to Game Dev JSON structure)
            if (phase.description) {
                const desc = document.createElement('p');
                desc.className = 'phase-description';
                desc.innerText = phase.description;
                phaseBlock.appendChild(desc);
            }

            // 3. Create Container for Modules
            const modulesContainer = document.createElement('div');
            modulesContainer.className = 'modules-container';

            // 4. Create Modules (Mapping 'resources' to visual nodes)
            if (phase.resources && Array.isArray(phase.resources)) {
                phase.resources.forEach(res => {
                    const link = document.createElement('a');
                    link.className = `module-node ${globalModuleIndex % 2 === 0 ? 'left' : 'right'}`;
                    link.href = res.url;
                    link.target = "_blank";
                    
                    // Default all to unlocked as Game Dev JSON has no status field
                    link.setAttribute('data-status', 'unlocked');

                    // Note: resources in JSON have 'name' and 'url', but no 'desc'
                    // We use a generic label or omit the description paragraph
                    link.innerHTML = `
                        <h4>${res.name}</h4>
                        <p>Click to view resource</p>
                    `;

                    modulesContainer.appendChild(link);
                    globalModuleIndex++;
                });
            }

            phaseBlock.appendChild(modulesContainer);
            container.appendChild(phaseBlock);
        });

        // Initialize GSAP Animations
        animateRoadmap();

    } catch (error) {
        console.error(error);
        container.innerHTML = `<div style="text-align:center; color:red;">[ERROR] ROADMAP_DATA_CORRUPTED: ${error.message}</div>`;
    }
}

function animateRoadmap() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate Spine
    gsap.from('.roadmap-spine', {
        height: 0,
        duration: 2,
        ease: 'power1.inOut'
    });

    // Animate Phase Headers
    gsap.utils.toArray('.phase-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 80%"
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    });

    // Animate Module Nodes
    gsap.utils.toArray('.module-node').forEach(node => {
        gsap.from(node, {
            scrollTrigger: {
                trigger: node,
                start: "top 85%"
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
}