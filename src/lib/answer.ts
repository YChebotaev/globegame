
function getDayCode(day: Date) {
    const [year, month, date] = day.toLocaleDateString("en-CA").split("-");
    return Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(date));
}

function randC(dayCode: number) {
    return Math.floor(dayCode / (8649)) % 197;
}

export function generateAnswer() {
    return randC(getDayCode(new Date()));
}

export const t_id = generateAnswer();
