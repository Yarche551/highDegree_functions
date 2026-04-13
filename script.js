let person = [];
let cities = [];
let specializations = [];

Promise.all(
    [
        fetch("person.json"),
        fetch("cities.json"),
        fetch("specializations.json"),
    ]
).then(async ([personResponce, citiesResponse, specializationsResponse]) => {
    const personJson = await personResponce.json();
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [personJson, citiesJson, specializationsJson];
}
).then(response => {
    person = response[0];
    cities = response[1];
    specializations = response[2];

    // раскомментировать для проверки 2 3 4 пунктов
    // person.forEach(p => {
    //     console.log(getInfo.call(p))
    // });
    // getInfo();

    ageCheck();
    getBackend();
    
    getTeam();



});




// 2 пункт - раскомментировать
// function getInfo() {
//     const city = cities.find(c => c.id === this.personal.locationId);
//     return `${this.personal.firstName} ${this.personal.lastName}, ${city.name}`;
// }

// 3 пункт - раскомментировать
// function getInfo() {
//     let designer = specializations.find(item => item.name === 'designer');
//     if (designer) {
//         let result = person.filter(p => {
//             return (p.personal.specializationId === designer.id && p.skills.some(skill => skill.name === 'Figma'));
//         });
//         console.log(result);
//     }
// }

// 4 пункт - раскомментировать
// function getInfo() {
//     let result = person.find(p => p.skills.some(skill => skill.name === 'React'));
//     console.log(result);
// }


// 5 пункт
function ageCheck() {
    const current = new Date();
    person.forEach(p => {
        let noReviewDate = p.personal.birthday;
        let dateParts = p.personal.birthday.split('.');
        let reviewDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);

        let age = current.getFullYear() - reviewDate.getFullYear();
        console.log(age > 18);
    });
}


// 6 пункт
function getBackend() {
    let city = cities.find(c => c.name === 'Москва');
    let backend = specializations.find(s => s.name === 'backend');

    let result = person
        .filter(p => {
            let employment = p.request.find(item => item.name === 'Тип занятости');

            return (
                p.personal.locationId === city.id &&
                p.personal.specializationId === backend.id &&
                employment?.value === 'Полная'
            );
        })
        .sort((a, b) => {
            let salaryA = a.request.find(item => item.name === 'Зарплата')?.value ?? 0;
            let salaryB = b.request.find(item => item.name === 'Зарплата')?.value ?? 0;

            return salaryA - salaryB;
        });
    console.log(result);
}

// 7 пункт
function getDesigners() {
    let specialization = specializations.find(s => s.name === 'designer');
    let result = person.filter(p => {
        const skillFigma = p.skills.some(s => s.name === 'Figma' && s.level >= 6);
        const skillPs = p.skills.some(s => s.name === 'Photoshop' && s.level >= 6);
        return p.personal.specializationId === specialization.id && skillFigma && skillPs;
    });
    console.log(result);
}

// 8 пункт
function getInfo() {
    const city = cities.find(c => c.id === this.personal.locationId);
    const specialization = specializations.find(s => s.id === this.personal.specializationId);
    return `${this.personal.firstName} ${this.personal.lastName} — ${specialization?.name || 'unknown'} (${city?.name || 'unknown'})`;
}

function getBestBySkill(specializationName, skillName) {
    const specialization = specializations.find(s => s.name === specializationName);
    if (!specialization) {
        return null;
    }

    return person
        .filter(p => p.personal.specializationId === specialization.id)
        .filter(p => p.skills.some(skill => skill.name === skillName))
        .reduce((best, current) => {
            const currentLevel = current.skills.find(skill => skill.name === skillName)?.level ?? 0;
            const bestLevel = best?.skills.find(skill => skill.name === skillName)?.level ?? -1;
            return currentLevel > bestLevel ? current : best;
        }, null);
}

function getTeam() {
    const designer = getBestBySkill('designer', 'Figma');
    const frontend = getBestBySkill('frontend', 'Angular');
    const backend = getBestBySkill('backend', 'Go');

    if (!designer || !frontend || !backend) {
        console.warn('Не удалось собрать всю команду');
        return;
    }

    console.log('Команда проекта:');
    console.log(getInfo.call(designer));
    console.log(getInfo.call(frontend));
    console.log(getInfo.call(backend));
}







