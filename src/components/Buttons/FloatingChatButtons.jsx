import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { BsFillChatRightDotsFill } from 'react-icons/bs';
import DraggableChatBtn from './DraggableChatBtn';
import { useDraggableBtn } from './useDraggableBtn';

const GAP = 12; // minimum vertical gap (px) between the two buttons

/**
 * FloatingChatButtons
 * Renders two independently draggable tab buttons on the right edge.
 * Prevents overlap by nudging the sibling button when either is dragged.
 *
 * Props:
 *  - activeChatMode    {string|null} Current open mode ('voice' | 'text' | null)
 *  - onVoiceChatOpen   {function}    Called when the VOICE CHAT button is clicked
 *  - onIntelgenzOpen   {function}    Called when the INTELGENZ CHAT button is clicked
 */
export default function FloatingChatButtons({ activeChatMode, onVoiceChatOpen, onIntelgenzOpen }) {
  const voiceBtn = useDraggableBtn(window.innerHeight * 0.35);
  const intelBtn = useDraggableBtn(window.innerHeight * 0.35 + 160 + GAP);

  const voiceBtnRef = useRef(null);
  const intelBtnRef = useRef(null);

  // After first paint — correct initial positions using real heights
  useLayoutEffect(() => {
    const voiceH = voiceBtnRef.current?.offsetHeight ?? 150;
    const startY = window.innerHeight * 0.35;
    const correctedIntel = startY + voiceH + GAP;

    voiceBtn.topRef.current = startY;
    voiceBtn.setTop(startY);
    intelBtn.topRef.current = correctedIntel;
    intelBtn.setTop(correctedIntel);
  }, []); // eslint-disable-line

  // Push intelBtn down when voiceBtn moves too close
  useEffect(() => {
    const voiceH = voiceBtnRef.current?.offsetHeight ?? 150;
    const voiceBottom = voiceBtn.top + voiceH + GAP;
    if (intelBtn.topRef.current < voiceBottom) {
      const intelH = intelBtnRef.current?.offsetHeight ?? 150;
      const clamped = Math.min(voiceBottom, window.innerHeight - intelH);
      intelBtn.topRef.current = clamped;
      intelBtn.setTop(clamped);
    }
  }, [voiceBtn.top]); // eslint-disable-line

  // Push voiceBtn up when intelBtn moves too close
  useEffect(() => {
    const voiceH = voiceBtnRef.current?.offsetHeight ?? 150;
    const intelTop = intelBtn.top - GAP;
    if (voiceBtn.topRef.current + voiceH > intelTop) {
      const clamped = Math.max(intelTop - voiceH, 0);
      voiceBtn.topRef.current = clamped;
      voiceBtn.setTop(clamped);
    }
  }, [intelBtn.top]); // eslint-disable-line

  // Prevent the click from firing after a drag
  const makeClickGuard = (dragState, handler) => (e) => {
    const moved = Math.abs(dragState.topRef.current - dragState.startTopSnapshot);
    if (moved > 4) { e.preventDefault(); return; }
    handler();
  };

  const handleVoiceMouseDown = useCallback((e) => {
    voiceBtn.onMouseDown(e);
  }, [voiceBtn]);

  return (
    <>
      {activeChatMode !== 'voice' && (
        <DraggableChatBtn
          ref={voiceBtnRef}
          top={voiceBtn.top}
          onMouseDown={handleVoiceMouseDown}
          onClick={onVoiceChatOpen}
          label="VOICE CHAT"
          icon={
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.98594 5.64236C10.1716 5.49657 10.3883 5.39551 10.6193 5.34701C10.8503 5.2985 11.0894 5.30386 11.318 5.36268L15.068 6.31424C15.4077 6.4019 15.7084 6.60044 15.9226 6.87838C16.1367 7.15632 16.2519 7.49777 16.25 7.84861L16.25 8.40486C16.2519 8.75571 16.1367 9.09716 15.9226 9.3751C15.7084 9.65304 15.4077 9.85157 15.068 9.93924L11.318 10.8908C11.0894 10.9496 10.8503 10.955 10.6193 10.9065C10.3883 10.858 10.1716 10.7569 9.98594 10.6111C9.79522 10.4634 9.64096 10.2739 9.53504 10.0572C9.42912 9.84047 9.37437 9.60233 9.375 9.36111L9.375 6.90018C9.37316 6.65764 9.42734 6.41796 9.53331 6.19979C9.63927 5.98162 9.79417 5.79086 9.98594 5.64236ZM7.1875 5.93924C6.75485 5.93924 6.33192 6.06753 5.97219 6.3079C5.61246 6.54827 5.33208 6.88991 5.16651 7.28962C5.00095 7.68933 4.95763 8.12917 5.04203 8.5535C5.12644 8.97783 5.33478 9.36761 5.6407 9.67353C5.94663 9.97946 6.33641 10.1878 6.76074 10.2722C7.18507 10.3566 7.62491 10.3133 8.02462 10.1477C8.42433 9.98216 8.76597 9.70178 9.00634 9.34205C9.2467 8.98232 9.375 8.55939 9.375 8.12674C9.375 7.54658 9.14453 6.99018 8.7343 6.57994C8.32406 6.16971 7.76766 5.93924 7.1875 5.93924ZM9.29687 3.90799C9.37656 3.9321 9.46025 3.94005 9.54305 3.93138C9.62585 3.9227 9.70608 3.89757 9.77903 3.85745C9.85198 3.81734 9.91619 3.76306 9.96787 3.6978C10.0196 3.63253 10.0577 3.5576 10.08 3.4774C10.1023 3.3972 10.1084 3.31334 10.0979 3.23076C10.0874 3.14818 10.0604 3.06853 10.0187 2.99649C9.97698 2.92446 9.92128 2.86148 9.85488 2.81127C9.78848 2.76105 9.71271 2.72461 9.63203 2.70408C8.79648 2.47183 7.91854 2.43592 7.06681 2.59916C6.21508 2.7624 5.41263 3.12037 4.72215 3.64509C4.03168 4.16982 3.47189 4.84709 3.08651 5.62399C2.70113 6.4009 2.50061 7.25638 2.50061 8.12361C2.50061 8.99085 2.70113 9.84633 3.08651 10.6232C3.47189 11.4001 4.03168 12.0774 4.72215 12.6021C5.41263 13.1269 6.21508 13.4848 7.06681 13.6481C7.91854 13.8113 8.79648 13.7754 9.63203 13.5431C9.77623 13.4866 9.89431 13.3786 9.96337 13.2399C10.0324 13.1013 10.0476 12.942 10.0058 12.7928C9.96409 12.6437 9.86845 12.5153 9.73746 12.4327C9.60648 12.35 9.44947 12.319 9.29687 12.3455C8.64754 12.5238 7.9658 12.5499 7.30474 12.4216C6.64368 12.2934 6.02116 12.0142 5.48565 11.606C4.95013 11.1977 4.51609 10.6714 4.21731 10.0679C3.91853 9.46442 3.76309 8.80012 3.76309 8.12674C3.76309 7.45335 3.91853 6.78906 4.21731 6.18558C4.51609 5.58211 4.95013 5.05575 5.48565 4.64749C6.02116 4.23924 6.64368 3.96011 7.30474 3.83184C7.9658 3.70357 8.64754 3.72963 9.29687 3.90799ZM-1.81694e-07 8.12674C-0.00036025 9.86983 0.559859 11.5668 1.59792 12.9671C2.63598 14.3674 4.09685 15.3967 5.76477 15.9031C7.43269 16.4094 9.21924 16.3659 10.8606 15.7791C12.5019 15.1922 13.911 14.093 14.8797 12.6439C14.9253 12.5757 14.9571 12.4991 14.9732 12.4186C14.9893 12.3381 14.9893 12.2553 14.9733 12.1747C14.9574 12.0942 14.9257 12.0176 14.8802 11.9493C14.8346 11.881 14.776 11.8224 14.7078 11.7767C14.6396 11.7311 14.563 11.6993 14.4825 11.6832C14.402 11.6672 14.3191 11.6671 14.2386 11.6831C14.1581 11.699 14.0815 11.7307 14.0132 11.7763C13.9449 11.8218 13.8863 11.8804 13.8406 11.9486C13.0208 13.1744 11.8286 14.1042 10.44 14.6006C9.05133 15.0969 7.53988 15.1337 6.12878 14.7053C4.71768 14.2769 3.48171 13.4062 2.60336 12.2216C1.72501 11.037 1.25083 9.60143 1.25083 8.12674C1.25083 6.65205 1.72501 5.21644 2.60336 4.03187C3.48171 2.8473 4.71768 1.97655 6.12878 1.54818C7.53988 1.11981 9.05133 1.15653 10.44 1.65292C11.8286 2.1493 13.0208 3.07904 13.8406 4.30486C13.9328 4.44265 14.076 4.53817 14.2386 4.5704C14.4012 4.60263 14.57 4.56894 14.7078 4.47674C14.8456 4.38453 14.9411 4.24137 14.9733 4.07874C15.0056 3.91611 14.9719 3.74734 14.8797 3.60955C13.911 2.16044 12.5019 1.06129 10.8606 0.474416C9.21924 -0.112454 7.43269 -0.155924 5.76477 0.350425C4.09685 0.856774 2.63598 1.8861 1.59792 3.28638C0.559858 4.68666 -0.000360403 6.38365 -1.81694e-07 8.12674Z" fill="url(#paint0_linear_1519_6455)" />
              <defs>
                <linearGradient id="paint0_linear_1519_6455" x1="40.784" y1="83.6433" x2="-4.11271" y2="-0.451775" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#BCBFFF" />
                  <stop offset="0.197115" stopColor="#FF0000" />
                  <stop offset="0.55" stopColor="#000DFF" />
                  <stop offset="0.783654" stopColor="#FF0000" />
                  <stop offset="1" stopColor="#BCBFFF" />
                </linearGradient>
              </defs>
            </svg>
          }
        />
      )}

      {activeChatMode !== 'text' && (
        <DraggableChatBtn
          ref={intelBtnRef}
          top={intelBtn.top}
          onMouseDown={intelBtn.onMouseDown}
          onClick={onIntelgenzOpen}
          label="INTELGENZ CHAT"
          icon={
            <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-6.55672e-07 1.24998L-5.46402e-08 15C-4.0149e-08 15.3315 0.131696 15.6494 0.366116 15.8839C0.600537 16.1183 0.918479 16.25 1.25 16.25L13.75 16.25C13.9884 16.2514 14.2221 16.184 14.423 16.0558C14.624 15.9276 14.7836 15.7441 14.8828 15.5273C14.9597 15.3621 14.9997 15.1822 15 15C14.9993 14.7065 14.8947 14.4228 14.7047 14.1992L14.6992 14.1922L12.5 11.6406L12.5 1.24998C12.5 0.918456 12.3683 0.600514 12.1339 0.366094C11.8995 0.131673 11.5815 -2.33944e-05 11.25 -2.33799e-05L1.25 -2.29428e-05C0.918479 -2.29283e-05 0.600536 0.131674 0.366116 0.366095C0.131695 0.600514 -6.70163e-07 0.918457 -6.55672e-07 1.24998ZM7.1875 11.5625C7.1875 11.7479 7.13252 11.9292 7.0295 12.0833C6.92649 12.2375 6.78007 12.3577 6.60876 12.4286C6.43746 12.4996 6.24896 12.5181 6.0671 12.482C5.88525 12.4458 5.7182 12.3565 5.58709 12.2254C5.45598 12.0943 5.36669 11.9272 5.33051 11.7454C5.29434 11.5635 5.31291 11.375 5.38386 11.2037C5.45482 11.0324 5.57498 10.886 5.72915 10.783C5.88332 10.68 6.06458 10.625 6.25 10.625C6.49864 10.625 6.7371 10.7237 6.91291 10.8996C7.08873 11.0754 7.1875 11.3138 7.1875 11.5625ZM7.1875 8.12498C7.1875 8.3104 7.13252 8.49165 7.0295 8.64582C6.92649 8.8 6.78007 8.92016 6.60876 8.99111C6.43746 9.06207 6.24896 9.08064 6.0671 9.04446C5.88525 9.00829 5.7182 8.919 5.58709 8.78789C5.45598 8.65678 5.36669 8.48973 5.33051 8.30787C5.29434 8.12602 5.31291 7.93752 5.38386 7.76621C5.45482 7.59491 5.57498 7.44849 5.72915 7.34547C5.88332 7.24246 6.06458 7.18748 6.25 7.18748C6.49864 7.18748 6.7371 7.28625 6.91291 7.46206C7.08873 7.63788 7.1875 7.87634 7.1875 8.12498ZM7.1875 4.68748C7.1875 4.8729 7.13252 5.05415 7.0295 5.20832C6.92649 5.3625 6.78007 5.48266 6.60876 5.55361C6.43746 5.62457 6.24896 5.64314 6.0671 5.60696C5.88524 5.57079 5.7182 5.4815 5.58709 5.35039C5.45598 5.21928 5.36669 5.05223 5.33051 4.87037C5.29434 4.68852 5.31291 4.50002 5.38386 4.32871C5.45482 4.15741 5.57498 4.01099 5.72915 3.90797C5.88332 3.80496 6.06458 3.74998 6.25 3.74998C6.49864 3.74998 6.7371 3.84875 6.91291 4.02456C7.08873 4.20038 7.1875 4.43884 7.1875 4.68748Z" fill="url(#paint0_linear_1519_6450)" />
              <defs>
                <linearGradient id="paint0_linear_1519_6450" x1="37.6468" y1="83.6261" x2="-9.1735" y2="2.65759" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#BCBFFF" />
                  <stop offset="0.197115" stop-color="#FF0000" />
                  <stop offset="0.55" stop-color="#000DFF" />
                  <stop offset="0.783654" stop-color="#FF0000" />
                  <stop offset="1" stop-color="#BCBFFF" />
                </linearGradient>
              </defs>
            </svg>
          }
        />
      )}
    </>
  );
}
