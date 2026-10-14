import { gsap } from 'gsap';

const isReducedMotion = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * High-performance, technical "System Boot" loading sequence.
 * Top 1px latency bar sweeps across (200ms), divider lines sweep from left,
 * and content micro-staggers into view.
 */
export function initSystemBoot() {
  if (typeof window === 'undefined') return;

  const bootBar = document.getElementById('system-boot-bar');
  const dividers = document.querySelectorAll('.boot-divider');
  const elements = document.querySelectorAll('.boot-elem');

  if (isReducedMotion()) {
    if (bootBar) bootBar.style.display = 'none';
    dividers.forEach(d => ((d as HTMLElement).style.transform = 'none'));
    elements.forEach(e => {
      (e as HTMLElement).style.opacity = '1';
      (e as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const hasBooted = sessionStorage.getItem('portfolio_sys_boot');

  if (hasBooted) {
    if (bootBar) bootBar.style.display = 'none';
    dividers.forEach(d => ((d as HTMLElement).style.transform = 'none'));
    elements.forEach(e => {
      (e as HTMLElement).style.opacity = '1';
      (e as HTMLElement).style.transform = 'none';
    });
    return;
  }

  // First boot in session: run crisp 250ms sequence
  sessionStorage.setItem('portfolio_sys_boot', 'true');

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' }
  });

  if (bootBar) {
    tl.set(bootBar, { width: '0%', opacity: 1 })
      .to(bootBar, { width: '100%', duration: 0.22, ease: 'power3.inOut' })
      .to(bootBar, { opacity: 0, duration: 0.08, ease: 'power1.out' });
  }

  if (dividers.length > 0) {
    tl.fromTo(
      dividers,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.24, ease: 'expo.out', stagger: 0.04 },
      bootBar ? '-=0.12' : 0
    );
  }

  if (elements.length > 0) {
    tl.fromTo(
      elements,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out', stagger: 0.035 },
      '-=0.18'
    );
  }
}

/**
 * Creates and orchestrates active telemetry packet simulation
 * for the Stella State Machine SVG diagram.
 */
export function createStellaTelemetry(svg: SVGSVGElement) {
  if (isReducedMotion()) return null;

  // Ensure telemetry packet circle exists inside SVG
  let packet = svg.querySelector('.stella-telemetry-packet') as SVGCircleElement | null;
  if (!packet) {
    packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    packet.setAttribute('class', 'stella-telemetry-packet pointer-events-none');
    packet.setAttribute('r', '3');
    packet.setAttribute('fill', '#10B981');
    packet.setAttribute('opacity', '0');
    svg.appendChild(packet);
  }

  // Node highlight helpers
  const nodeIssue = svg.querySelector('#stella-node-issue');
  const nodePlan = svg.querySelector('#stella-node-plan');
  const nodeCode = svg.querySelector('#stella-node-code');
  const nodeReview = svg.querySelector('#stella-node-review');
  const nodeTest = svg.querySelector('#stella-node-test');
  const nodePr = svg.querySelector('#stella-node-pr');
  const badgeReject = svg.querySelector('#stella-badge-reject');

  const flash = (el: Element | null, color: string = '#10B981', dur: number = 0.15) => {
    if (!el) return;
    gsap.fromTo(el, { stroke: color, strokeWidth: 2 }, { stroke: '', strokeWidth: '', duration: dur, ease: 'power1.out' });
  };

  const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

  // Cycle 1: Standard Success Path (Issue -> Plan -> Code -> Review -> Test -> PR)
  const successCycle = gsap.timeline();
  successCycle
    .set(packet, { cx: 51, cy: 22, opacity: 0, fill: '#10B981' })
    .to(packet, { opacity: 1, duration: 0.08 })
    .add(() => flash(nodeIssue, '#10B981'))
    .to(packet, { cx: 143, cy: 22, duration: 0.28, ease: 'power1.inOut' })
    .add(() => flash(nodePlan))
    .to(packet, { cx: 221, cy: 22, duration: 0.26, ease: 'power1.inOut' })
    .add(() => flash(nodeCode))
    .to(packet, { cx: 304, cy: 22, duration: 0.26, ease: 'power1.inOut' })
    .add(() => flash(nodeReview))
    .to(packet, { cx: 387, cy: 22, duration: 0.26, ease: 'power1.inOut' })
    .add(() => flash(nodeTest))
    .to(packet, { cx: 476, cy: 22, duration: 0.28, ease: 'power1.inOut' })
    .add(() => flash(nodePr, '#34D399', 0.35))
    .to(packet, { opacity: 0, duration: 0.15 });

  // Cycle 2: Feedback Loop Path (Code -> Review -> REJECTED loopback -> Plan -> Test -> PR)
  const loopCycle = gsap.timeline();
  loopCycle
    .set(packet, { cx: 51, cy: 22, opacity: 0, fill: '#10B981' })
    .to(packet, { opacity: 1, duration: 0.08 })
    .to(packet, { cx: 143, cy: 22, duration: 0.24, ease: 'power1.inOut' })
    .to(packet, { cx: 221, cy: 22, duration: 0.24, ease: 'power1.inOut' })
    .to(packet, { cx: 304, cy: 22, duration: 0.24, ease: 'power1.inOut' })
    // Turn amber at Review
    .to(packet, { fill: '#D97706', duration: 0.05 })
    .add(() => flash(badgeReject, '#D97706', 0.3))
    // Loopback path: v 22 (y: 22 -> 44 -> 58), H 154, v -36 (y: 58 -> 22)
    .to(packet, { cy: 58, duration: 0.15, ease: 'power1.in' })
    .to(packet, { cx: 154, duration: 0.28, ease: 'power1.inOut' })
    .to(packet, { cy: 22, duration: 0.15, ease: 'power1.out' })
    .add(() => flash(nodePlan, '#D97706'))
    // Recover to green and finish
    .to(packet, { fill: '#10B981', duration: 0.05 })
    .to(packet, { cx: 387, cy: 22, duration: 0.35, ease: 'power1.inOut' })
    .to(packet, { cx: 476, cy: 22, duration: 0.25, ease: 'power1.inOut' })
    .add(() => flash(nodePr, '#34D399', 0.35))
    .to(packet, { opacity: 0, duration: 0.15 });

  masterTl.add(successCycle).add(loopCycle, '+=0.6');

  return masterTl;
}

/**
 * Creates and orchestrates active telemetry packet simulation
 * for the Payment Platform Architecture SVG diagram.
 */
export function createPaymentTelemetry(svg: SVGSVGElement) {
  if (isReducedMotion()) return null;

  let packet = svg.querySelector('.payment-telemetry-packet') as SVGCircleElement | null;
  if (!packet) {
    packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    packet.setAttribute('class', 'payment-telemetry-packet pointer-events-none');
    packet.setAttribute('r', '3');
    packet.setAttribute('fill', '#3B82F6');
    packet.setAttribute('opacity', '0');
    svg.appendChild(packet);
  }

  const nodeIngress = svg.querySelector('#pay-node-ingress');
  const nodeIdempotency = svg.querySelector('#pay-node-idempotency');
  const nodeFraud = svg.querySelector('#pay-node-fraud');
  const nodeDispatch = svg.querySelector('#pay-node-dispatch');
  const nodeSettled = svg.querySelector('#pay-node-settled');
  const badgeDlq = svg.querySelector('#pay-badge-dlq');

  const flash = (el: Element | null, color: string = '#3B82F6', dur: number = 0.15) => {
    if (!el) return;
    gsap.fromTo(el, { stroke: color, strokeWidth: 2 }, { stroke: '', strokeWidth: '', duration: dur, ease: 'power1.out' });
  };

  const masterTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

  // Cycle 1: Clean Transaction Flow (Ingress -> Idempotency -> Fraud -> Dispatch -> Settled)
  const settledCycle = gsap.timeline();
  settledCycle
    .set(packet, { cx: 46, cy: 22, opacity: 0, fill: '#3B82F6' })
    .to(packet, { opacity: 1, duration: 0.08 })
    .add(() => flash(nodeIngress, '#3B82F6'))
    .to(packet, { cx: 148, cy: 22, duration: 0.28, ease: 'power1.inOut' })
    .add(() => flash(nodeIdempotency, '#3B82F6'))
    .to(packet, { cx: 254, cy: 22, duration: 0.26, ease: 'power1.inOut' })
    .add(() => flash(nodeFraud, '#3B82F6'))
    .to(packet, { cx: 350, cy: 22, duration: 0.26, ease: 'power1.inOut' })
    .add(() => flash(nodeDispatch, '#3B82F6'))
    // Settle with emerald confirmation
    .to(packet, { fill: '#10B981', duration: 0.05 })
    .to(packet, { cx: 460, cy: 22, duration: 0.28, ease: 'power1.inOut' })
    .add(() => flash(nodeSettled, '#10B981', 0.35))
    .to(packet, { opacity: 0, duration: 0.15 });

  // Cycle 2: Fraud Spike / DLQ Rejection Path
  const dlqCycle = gsap.timeline();
  dlqCycle
    .set(packet, { cx: 46, cy: 22, opacity: 0, fill: '#3B82F6' })
    .to(packet, { opacity: 1, duration: 0.08 })
    .to(packet, { cx: 148, cy: 22, duration: 0.24, ease: 'power1.inOut' })
    .to(packet, { cx: 254, cy: 22, duration: 0.24, ease: 'power1.inOut' })
    // Turn red at Fraud Engine
    .to(packet, { fill: '#DC2626', duration: 0.05 })
    .add(() => flash(nodeFraud, '#DC2626'))
    .add(() => flash(badgeDlq, '#DC2626', 0.3))
    // Drop to DLQ loopback: cy: 22 -> 58, cx: 254 -> 148, cy: 58 -> 42
    .to(packet, { cy: 58, duration: 0.15, ease: 'power1.in' })
    .to(packet, { cx: 148, duration: 0.28, ease: 'power1.inOut' })
    .to(packet, { cy: 38, opacity: 0, duration: 0.12, ease: 'power1.out' });

  masterTl.add(settledCycle).add(dlqCycle, '+=0.6');

  return masterTl;
}

/**
 * High-speed numerical ticker counter for GitHub stats
 */
export function animateStatCounter(element: HTMLElement | null, targetVal: number, suffix: string = '') {
  if (!element || isReducedMotion()) {
    if (element) element.textContent = `${targetVal}${suffix}`;
    return;
  }

  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetVal,
    duration: 0.3,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = `${Math.round(obj.val)}${suffix}`;
    }
  });
}

/**
 * Micro-stagger ripple for the GitHub contribution grid
 */
export function animateGridRipple(gridEl: HTMLElement | null) {
  if (!gridEl || isReducedMotion()) return;
  const cells = gridEl.querySelectorAll('div:not(.pointer-events-none)');
  if (cells.length === 0) return;

  gsap.fromTo(
    cells,
    { opacity: 0.2, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 0.18, stagger: 0.0008, ease: 'power1.out' }
  );
}

/**
 * Snappy modal dialog entrance
 */
export function animateModalOpen(container: HTMLElement | null, backdrop: HTMLElement | null) {
  if (isReducedMotion()) return;

  if (backdrop) {
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power1.out' });
  }

  if (container) {
    gsap.fromTo(
      container,
      { opacity: 0, scale: 0.985, y: -4 },
      { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: 'expo.out' }
    );
  }
}
