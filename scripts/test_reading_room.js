const fs = require('fs');

const content = fs.readFileSync('pages/reading-room.html', 'utf8');

// 1. Check max-width of reading-room-app
const maxWidthMatch = content.match(/\.reading-room-app\s*\{[^}]*max-width:\s*([^;]+);/i);
console.log('1. reading-room-app max-width:', maxWidthMatch ? maxWidthMatch[1] : 'Not found');

// 2. Check if showUserDetailView and hideUserDetailView exist in <script>
const hasShowDetail = content.includes('function showUserDetailView');
const hasHideDetail = content.includes('function hideUserDetailView');
const hasOpenProfile = content.includes('function openUserProfileModal');
console.log('2. Script functions defined:');
console.log('   showUserDetailView:', hasShowDetail);
console.log('   hideUserDetailView:', hasHideDetail);
console.log('   openUserProfileModal alias:', hasOpenProfile);

// 3. Check Rank cards count
const rankCards = content.match(/class="rr-rank-card"/g);
console.log('3. Total rr-rank-card count (should be exactly 5):', rankCards ? rankCards.length : 0);

// 4. Check medals on rank cards
const goldMedal = content.includes('🥇 ১');
const silverMedal = content.includes('🥈 ২');
const bronzeMedal = content.includes('🥉 ৩');
console.log('4. Medals present:');
console.log('   Gold (🥇 ১):', goldMedal);
console.log('   Silver (🥈 ২):', silverMedal);
console.log('   Bronze (🥉 ৩):', bronzeMedal);

// 5. Check if Rank 4 and Rank 5 have no medals
const rank4 = content.match(/<span class="rr-rank-number">৪<\/span>/);
const rank5 = content.match(/<span class="rr-rank-number">৫<\/span>/);
console.log('5. Rank numbers without medals:');
console.log('   Rank 4 (৪):', !!rank4);
console.log('   Rank 5 (৫):', !!rank5);

// 6. Check study times order: Niloy > Psycho > Spider-man > Mow > Safayet
const timeMatches = [...content.matchAll(/<span class="rr-time-val">([^<]+)<\/span>/g)].map(m => m[1]);
console.log('6. Rank study times in order:', timeMatches);

// 7. Check 4 stat cards in detail view
const statToday = content.includes('detailStatToday');
const statWeek = content.includes('detailStatWeek');
const statMonth = content.includes('detailStatMonth');
const statTotal = content.includes('detailStatTotal');
console.log('7. Detail view 4 stat boxes:', { statToday, statWeek, statMonth, statTotal });

// 8. Check all model tests list in detail view
const examFullList = content.includes('id="detailExamFullList"');
console.log('8. All model tests dynamic list container:', examFullList);

// 9. Check footer developer image and card
const footerDevImg = content.includes('src="../assets/images/developer.jpg"');
console.log('9. Footer developer image (../assets/images/developer.jpg):', footerDevImg);

// 10. Check bottom navigation bar
const bottomNav = content.includes('class="bottom-nav"');
console.log('10. Bottom mobile nav present:', bottomNav);
