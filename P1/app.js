/* ==========================================================================
   AETHERIS AVIATION - LUXURY SHOWROOM INTERACTION LOGIC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Header Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Fleet Specifications & Showroom Database ---
  const fleetData = {
    longrange: {
      name: "Aetheris Legacy 9000",
      class: "Ultra Long-Range Jet",
      desc: "Designed for transcontinental luxury, the Legacy 9000 matches speed with unprecedented range, bridging global capitals effortlessly.",
      image: "assets/aircraft_longrange.png",
      quote: "Crossing oceans, raising bars.",
      specs: {
        range: 7700,    // max 8000
        speed: 516,     // max 600
        passengers: 19, // max 20
        height: 6.2     // max 7
      },
      specLabels: {
        range: "7,700 NM",
        speed: "Mach 0.90 (516 KTAS)",
        passengers: "Up to 19 Passengers",
        height: "6 ft 2 in"
      }
    },
    midsize: {
      name: "Aetheris Horizon X",
      class: "Super Midsize Jet",
      desc: "The ultimate combination of cabin spacing, airfield agility, and speed. Perfect for domestic executive transits and regional routes.",
      image: "assets/aircraft_midsize.png",
      quote: "Efficiency meets state-of-the-art elegance.",
      specs: {
        range: 4200,
        speed: 482,
        passengers: 12,
        height: 5.9
      },
      specLabels: {
        range: "4,200 NM",
        speed: "Mach 0.84 (482 KTAS)",
        passengers: "Up to 12 Passengers",
        height: "5 ft 9 in"
      }
    },
    evtol: {
      name: "Aetheris Solis",
      class: "Electric Hybrid VTOL Concept",
      desc: "Embrace tomorrow with green aviation. Fully vertical takeoff and landing coupled with zero-emission cruise for quick urban jumps.",
      image: "assets/aircraft_evtol.png",
      quote: "Silent vertical ascents, sustainable future skies.",
      specs: {
        range: 1200,
        speed: 280,
        passengers: 6,
        height: 5.2
      },
      specLabels: {
        range: "1,200 NM",
        speed: "280 KTAS (All-Electric)",
        passengers: "Up to 6 Passengers",
        height: "5 ft 2 in"
      }
    }
  };

  // Switch fleet display details
  const fleetCards = document.querySelectorAll('.fleet-card');
  const specDisplayImg = document.getElementById('spec-display-img');
  const specHeaderTitle = document.getElementById('spec-header-title');
  const specClass = document.getElementById('spec-class');
  const specQuote = document.getElementById('spec-quote');
  const specDesc = document.getElementById('spec-desc');
  
  // Progress Bar elements
  const barRange = document.getElementById('bar-range');
  const labelRange = document.getElementById('label-range');
  const barSpeed = document.getElementById('bar-speed');
  const labelSpeed = document.getElementById('label-speed');
  const barPax = document.getElementById('bar-pax');
  const labelPax = document.getElementById('label-pax');
  const barHeight = document.getElementById('bar-height');
  const labelHeight = document.getElementById('label-height');

  const updateSpecPanel = (key) => {
    const data = fleetData[key];
    if (!data) return;

    // Apply smooth fade-out
    specDisplayImg.style.opacity = '0';
    
    setTimeout(() => {
      // Update Texts
      specDisplayImg.src = data.image;
      specHeaderTitle.textContent = data.name;
      specClass.textContent = data.class;
      specQuote.textContent = `"${data.quote}"`;
      specDesc.textContent = data.desc;
      
      // Update Progress Bars (Percentage calculations relative to bounds)
      const rangePct = (data.specs.range / 8000) * 100;
      const speedPct = (data.specs.speed / 600) * 100;
      const paxPct = (data.specs.passengers / 20) * 100;
      const heightPct = (data.specs.height / 7) * 100;

      barRange.style.width = `${rangePct}%`;
      labelRange.textContent = data.specLabels.range;

      barSpeed.style.width = `${speedPct}%`;
      labelSpeed.textContent = data.specLabels.speed;

      barPax.style.width = `${paxPct}%`;
      labelPax.textContent = data.specLabels.passengers;

      barHeight.style.width = `${heightPct}%`;
      labelHeight.textContent = data.specLabels.height;

      // Fade-in image
      specDisplayImg.style.opacity = '1';
    }, 300);
  };

  // Add click handlers for catalog cards
  fleetCards.forEach(card => {
    card.addEventListener('click', () => {
      fleetCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const key = card.getAttribute('data-aircraft');
      updateSpecPanel(key);
    });
  });

  // Initialize Spec Panel with first aircraft
  updateSpecPanel('longrange');


  // --- 3. Simulated 360-Degree Cabin Pan Viewer ---
  const viewport = document.getElementById('panoramic-viewport');
  const canvas = document.getElementById('panoramic-canvas');
  
  if (viewport && canvas) {
    let isDragging = false;
    let startX = 0;
    let currentTranslateX = -30; // initial percent value
    const minTranslate = -140;   // limit panning left
    const maxTranslate = 0;      // limit panning right

    // Drag / Touch Events
    const startDrag = (e) => {
      isDragging = true;
      viewport.style.cursor = 'grabbing';
      startX = (e.pageX || e.touches[0].pageX) - viewport.offsetLeft;
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - viewport.offsetLeft;
      const walk = (x - startX) * 0.15; // drag sensitivity factor
      
      let nextTranslate = currentTranslateX + walk;
      
      // Bounds constraint
      if (nextTranslate > maxTranslate) nextTranslate = maxTranslate;
      if (nextTranslate < minTranslate) nextTranslate = minTranslate;

      canvas.style.transform = `translateX(${nextTranslate}%)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      viewport.style.cursor = 'grab';
      
      // Parse current translate from computed styles to preserve state
      const style = window.getComputedStyle(canvas);
      const matrix = new WebKitCSSMatrix(style.transform);
      const currentPx = matrix.m41;
      const parentWidth = viewport.offsetWidth;
      currentTranslateX = (currentPx / parentWidth) * 100;
    };

    viewport.addEventListener('mousedown', startDrag);
    viewport.addEventListener('mousemove', drag);
    viewport.addEventListener('mouseup', endDrag);
    viewport.addEventListener('mouseleave', endDrag);

    viewport.addEventListener('touchstart', startDrag);
    viewport.addEventListener('touchmove', drag);
    viewport.addEventListener('touchend', endDrag);
  }


  // --- 4. Cabin Customizer (Configurator) ---
  const configuratorBox = document.getElementById('configurator-preview-box');
  const configImg = document.getElementById('config-img');
  
  // Layout Options
  const layoutBtns = document.querySelectorAll('.layout-btn');
  const layoutAssets = {
    executive: 'assets/cabin_executive.png',
    dining: 'assets/cabin_dining.png',
    bedroom: 'assets/cabin_bedroom.png'
  };

  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layoutBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layout = btn.getAttribute('data-layout');
      
      if (layoutAssets[layout]) {
        configImg.style.opacity = '0.3';
        setTimeout(() => {
          configImg.src = layoutAssets[layout];
          configImg.style.opacity = '1';
        }, 300);
      }
    });
  });

  // Wood & Trim Finish Options
  const materialOptions = document.querySelectorAll('.material-option');
  materialOptions.forEach(option => {
    option.addEventListener('click', () => {
      materialOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      
      // Dynamic details shift
      const finishName = option.querySelector('.material-name').textContent;
      // We simulate leather/walnut filters via subtle overlay tints and opacity changes
      if (finishName === 'walnut' || finishName === 'obsidian') {
        configuratorBox.style.setProperty('--light-overlay', 'rgba(101, 67, 33, 0.15)');
      } else {
        configuratorBox.style.setProperty('--light-overlay', 'rgba(255, 255, 255, 0.04)');
      }
    });
  });

  // Mood Lighting Options
  const lightBtns = document.querySelectorAll('.light-btn');
  const lightColorOverlays = {
    amber: 'rgba(212, 175, 55, 0.08)',
    cyan: 'rgba(0, 242, 254, 0.12)',
    violet: 'rgba(189, 0, 255, 0.12)'
  };

  lightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mood = btn.getAttribute('data-mood');
      
      if (lightColorOverlays[mood]) {
        configuratorBox.style.setProperty('--light-overlay', lightColorOverlays[mood]);
        // Update box shadow glow based on lighting
        if (mood === 'cyan') {
          configuratorBox.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 242, 254, 0.15)';
        } else if (mood === 'violet') {
          configuratorBox.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(189, 0, 255, 0.15)';
        } else {
          configuratorBox.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(212, 175, 55, 0.1)';
        }
      }
    });
  });


  // --- 5. Flight Range Estimator & Math Modeler ---
  const rangeSlider = document.getElementById('range-slider');
  const sliderCounter = document.getElementById('slider-counter');
  const citySelect = document.getElementById('city-select');
  const rangeRing = document.getElementById('range-ring');
  const rangeCenter = document.getElementById('range-center');
  
  // Suggested Jet labels
  const recImg = document.getElementById('rec-img');
  const recName = document.getElementById('rec-name');

  // Map coordinates representing city nodes in clean responsive SVG space (800x480 coordinate box)
  const cityCoordinates = {
    london: { cx: 385, cy: 155, name: "London (LHR)" },
    newyork: { cx: 215, cy: 185, name: "New York (JFK)" },
    dubai: { cx: 480, cy: 215, name: "Dubai (DXB)" },
    tokyo: { cx: 685, cy: 185, name: "Tokyo (HND)" },
    singapore: { cx: 605, cy: 295, name: "Singapore (SIN)" }
  };

  const updateRangeVisuals = () => {
    const rangeVal = parseInt(rangeSlider.value);
    sliderCounter.textContent = `${rangeVal.toLocaleString()} NM`;
    
    const city = citySelect.value;
    const coords = cityCoordinates[city];
    
    if (coords && rangeRing && rangeCenter) {
      // Position circle and central locator dot
      rangeCenter.setAttribute('cx', coords.cx);
      rangeCenter.setAttribute('cy', coords.cy);
      
      rangeRing.setAttribute('cx', coords.cx);
      rangeRing.setAttribute('cy', coords.cy);
      
      // Calculate scaling mapping NM to SVG pixels. (Earth circumference scale)
      // London to New York is ~3000 NM. Our visual map shows it at distance of ~170 SVG px
      // scale factor ~ 0.055 SVG px per NM
      const pixelRadius = rangeVal * 0.046;
      rangeRing.setAttribute('r', pixelRadius);
    }

    // Recommendation logic based on needed range capability
    if (rangeVal <= 1200) {
      recImg.src = 'assets/aircraft_evtol.png';
      recName.textContent = 'Aetheris Solis (eVTOL)';
    } else if (rangeVal <= 4200) {
      recImg.src = 'assets/aircraft_midsize.png';
      recName.textContent = 'Aetheris Horizon X';
    } else {
      recImg.src = 'assets/aircraft_longrange.png';
      recName.textContent = 'Aetheris Legacy 9000';
    }
  };

  if (rangeSlider && citySelect) {
    rangeSlider.addEventListener('input', updateRangeVisuals);
    citySelect.addEventListener('change', updateRangeVisuals);
    updateRangeVisuals(); // initial load execution
  }


  // --- 6. Bespoke inquiry Form Wizard ---
  const bookingWizard = document.getElementById('booking-wizard');
  const formSteps = document.querySelectorAll('.form-step');
  const dots = document.querySelectorAll('.indicator-dot');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  let currentStep = 0;

  const updateWizardStep = () => {
    formSteps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx <= currentStep) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Toggle button layouts
    if (currentStep === 0) {
      btnPrev.style.visibility = 'hidden';
    } else {
      btnPrev.style.visibility = 'visible';
    }

    if (currentStep === formSteps.length - 1) {
      btnNext.textContent = "Submit Request";
    } else {
      btnNext.textContent = "Next Step";
    }
  };

  if (btnNext && btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateWizardStep();
      }
    });

    btnNext.addEventListener('click', (e) => {
      // Step Validation logic
      const activeStepEl = formSteps[currentStep];
      const inputs = activeStepEl.querySelectorAll('input, select, textarea');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
        } else {
          input.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        }
      });

      if (!isValid) return;

      if (currentStep < formSteps.length - 1) {
        currentStep++;
        updateWizardStep();
      } else {
        // Handle Submit logic
        e.preventDefault();
        
        // Extract inputs data for preview and submission
        const clientName = document.getElementById('client-name').value;
        const clientEmail = document.getElementById('client-email').value;
        const chosenJet = document.getElementById('client-aircraft').options[document.getElementById('client-aircraft').selectedIndex].text;
        const flightProfile = document.getElementById('client-use').options[document.getElementById('client-use').selectedIndex].text;
        const clientNotes = document.getElementById('client-notes').value;
        
        // Visual indicator of loading state
        btnNext.disabled = true;
        btnNext.textContent = "Securing...";

        // Send submission details to recipient email via FormSubmit.co
        fetch("https://formsubmit.co/ajax/pchaitra9876@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "Client Name": clientName,
            "Client Email": clientEmail,
            "Preferred Airframe": chosenJet,
            "Flight Profile": flightProfile,
            "Confidential Notes": clientNotes
          })
        })
        .then(() => {
          displaySuccess(clientName, chosenJet, clientEmail);
        })
        .catch((error) => {
          console.error("FormSubmit Error:", error);
          // Fall back gracefully to display completion details to client
          displaySuccess(clientName, chosenJet, clientEmail);
        });

        function displaySuccess(name, jet, email) {
          // Set dynamic values in success panel
          document.getElementById('success-client-name').textContent = name;
          document.getElementById('success-client-jet').textContent = jet;
          document.getElementById('success-client-email').textContent = email;

          // Toggle visibility
          document.getElementById('lounge-form').style.display = 'none';
          document.getElementById('wizard-indicator').style.display = 'none';
          document.getElementById('success-panel').style.display = 'block';
        }
      }
    });

    updateWizardStep();
  }

  // --- 7. Reset Wizard Form Handler ---
  const btnResetForm = document.getElementById('btn-reset-form');
  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      const loungeForm = document.getElementById('lounge-form');
      const wizardIndicator = document.getElementById('wizard-indicator');
      const successPanel = document.getElementById('success-panel');

      // Reset form controls
      loungeForm.reset();

      // Reset wizard step parameters
      currentStep = 0;
      updateWizardStep();

      // Restore form button state
      btnNext.disabled = false;
      btnNext.textContent = "Next Step";

      // Restore visibility
      loungeForm.style.display = 'block';
      wizardIndicator.style.display = 'flex';
      successPanel.style.display = 'none';
    });
  }
});
