// Orthodox Calendar - Fast Days, Feast Days, and Daily Scripture
// Based on Orthodox Church calendar

const ORTHODOX_CALENDAR = {
    // Major Feasts (Fixed Dates)
    feasts: {
        '01-06': { name: 'Theophany (Epiphany)', type: 'major', fasting: false },
        '02-02': { name: 'Presentation of Christ', type: 'major', fasting: false },
        '03-25': { name: 'Annunciation', type: 'major', fasting: false },
        '08-06': { name: 'Transfiguration', type: 'major', fasting: false },
        '08-15': { name: 'Dormition of the Theotokos', type: 'major', fasting: true },
        '09-08': { name: 'Nativity of the Theotokos', type: 'major', fasting: false },
        '09-14': { name: 'Elevation of the Cross', type: 'major', fasting: true },
        '11-21': { name: 'Entry of the Theotokos', type: 'major', fasting: false },
        '12-25': { name: 'Nativity of Christ (Christmas)', type: 'major', fasting: false }
    },
    
    // Fasting Periods
    fastingPeriods: [
        { name: 'Great Lent', start: 'variable', end: 'variable', type: 'strict' },
        { name: 'Apostles Fast', start: 'variable', end: 'variable', type: 'moderate' },
        { name: 'Dormition Fast', start: '08-01', end: '08-14', type: 'strict' },
        { name: 'Nativity Fast', start: '11-15', end: '12-24', type: 'moderate' }
    ],
    
    // Weekly Fasting Days
    weeklyFasting: {
        wednesday: { name: 'Wednesday Fast', reason: 'Betrayal of Christ' },
        friday: { name: 'Friday Fast', reason: 'Crucifixion of Christ' }
    }
};

// Get current date info
function getTodayInfo() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    const dayOfWeek = today.getDay(); // 0 = Sunday, 3 = Wednesday, 5 = Friday
    
    const info = {
        date: today,
        dateKey: dateKey,
        isFeast: false,
        isFasting: false,
        feast: null,
        fastingInfo: null
    };
    
    // Check for feast day
    if (ORTHODOX_CALENDAR.feasts[dateKey]) {
        info.isFeast = true;
        info.feast = ORTHODOX_CALENDAR.feasts[dateKey];
        if (info.feast.fasting) {
            info.isFasting = true;
            info.fastingInfo = { name: info.feast.name, type: 'feast' };
        }
    }
    
    // Check for weekly fasting (Wednesday and Friday, except during fast-free weeks)
    if (dayOfWeek === 3 || dayOfWeek === 5) {
        // Check if we're in a fast-free period (Pascha week, etc.)
        const isFastFreeWeek = checkFastFreeWeek(today);
        if (!isFastFreeWeek && !info.isFeast) {
            info.isFasting = true;
            info.fastingInfo = {
                name: dayOfWeek === 3 ? 'Wednesday Fast' : 'Friday Fast',
                type: 'weekly',
                reason: dayOfWeek === 3 ? 'Betrayal of Christ' : 'Crucifixion of Christ'
            };
        }
    }
    
    // Check for fasting periods
    const fastingPeriod = getCurrentFastingPeriod(today);
    if (fastingPeriod) {
        info.isFasting = true;
        info.fastingInfo = fastingPeriod;
    }
    
    return info;
}

function checkFastFreeWeek(date) {
    // Fast-free weeks: Bright Week (week after Pascha), Nativity, etc.
    // Simplified - in production would calculate Pascha date
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Bright Week approximation (week after Pascha - varies by year)
    // Nativity week (Dec 25 - Jan 1)
    if ((month === 12 && day >= 25) || (month === 1 && day <= 1)) {
        return true;
    }
    
    return false;
}

function getCurrentFastingPeriod(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    // Dormition Fast (Aug 1-14)
    if (month === '08' && parseInt(day) >= 1 && parseInt(day) <= 14) {
        return { name: 'Dormition Fast', type: 'strict', start: '08-01', end: '08-14' };
    }
    
    // Nativity Fast (Nov 15 - Dec 24)
    if (month === '11' && parseInt(day) >= 15) {
        return { name: 'Nativity Fast', type: 'moderate', start: '11-15', end: '12-24' };
    }
    if (month === '12' && parseInt(day) <= 24) {
        return { name: 'Nativity Fast', type: 'moderate', start: '11-15', end: '12-24' };
    }
    
    // Great Lent and Apostles Fast are variable - would need Pascha calculation
    // Simplified for now
    
    return null;
}

// Get daily scripture (from Orthodox lectionary)
// This would ideally fetch from an Orthodox lectionary API
// For now, provides daily readings structure
function getDailyScripture() {
    const today = new Date();
    const readings = {
        date: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        epistle: null,
        gospel: null,
        oldTestament: null,
        psalms: null
    };
    
    // In production, this would fetch from Orthodox lectionary
    // For now, return structure for API integration
    return readings;
}

module.exports = {
    getTodayInfo,
    getDailyScripture,
    ORTHODOX_CALENDAR
};
