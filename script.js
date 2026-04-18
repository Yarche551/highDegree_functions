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

    console.log(getInfo.call(person[0].personal));

    getFigmaDesigners();

    findReactDev();

    age18();

    getBackendDev();

    getDesigners();

    makeTeam();
});

// 2
function getInfo() {
    let city = cities.find(item => item.id === this.locationId);
    return `${this.firstName} ${this.lastName} ${city.name}`
}

// 3
function getFigmaDesigners() {
    let designer = specializations.find(item => item.name === 'designer');

    const result = person.filter(p => {
        const isDesigner = p.personal.specializationId === designer.id;
        const hasFigma = p.skills.some(skill => skill.name.toLowerCase() === 'figma');
        return isDesigner && hasFigma
    });
    result.forEach(p => {
        console.log(getInfo.call(p.personal));
    });
}

// 4
function findReactDev() {
    const frontend = specializations.find(item => item.name === 'frontend');
    const result = person.find(p => {
        const isReact = p.skills.some(skill => skill.name.toLowerCase() === 'react');
        const isFrontend = p.personal.specializationId === frontend.id;
        return isFrontend && isReact;
    });
    console.log(getInfo.call(result.personal));
}

// 5
function age18() {
    const result = person.every(item => {
        let dateParts = item.personal.birthday.split('.');
        let birthDate = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);

        let currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();

        return age >= 18;
    });
    console.log(result);
}

// 6
function getBackendDev() {
    let moscow = cities.find(item => item.name.toLowerCase() === 'москва');
    let backend = specializations.find(s => s.name.toLowerCase() === 'backend');

    const result = person.filter(p => {
        const isBackend = p.personal.specializationId === backend.id;
        const isMoscow = p.personal.locationId === moscow.id;

        const fullTime = p.request.some(r => {
            return r.name.toLowerCase() === 'тип занятости' && r.value.toLowerCase() === 'полная';
        });

        return isBackend && isMoscow && fullTime;
    }).sort((a, b) => {
        const salaryA = a.request.find(item => item.name.toLowerCase() === 'зарплата').value;
        const salaryB = b.request.find(item => item.name.toLowerCase() === 'зарплата').value;

        return salaryA - salaryB;
    });
    console.log(result);
}

// 7
function getDesigners() {
    const designer = specializations.find(s => s.name.toLowerCase() === 'designer');

    const result = person.filter(p => {
        const isDesigner = p.personal.specializationId === designer.id;
        const figmaSkill = p.skills.find(skill => skill.name.toLowerCase() === 'figma');
        const psSkill = p.skills.find(skill => skill.name.toLowerCase() === 'photoshop');

        const highSkillFigma = figmaSkill && figmaSkill.level >= 6;
        const highSkillPs = psSkill && psSkill.level >= 6;

        return isDesigner && highSkillFigma && highSkillPs;
    });

    result.forEach(item => {
        console.log(getInfo.call(item.personal));
    });
}

// 8
function getBestSkills(specName, skillName) {
    const spec = specializations.find(s => s.name.toLowerCase() === specName.toLowerCase());

    return person.filter(p => p.personal.specializationId === spec.id).sort((a, b) => {
        const skillA = a.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase());
        const skillB = b.skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase());

        const levelA = skillA ? skillA.level : 0;
        const levelB = skillB ? skillB.level : 0;

        return levelB - levelA;
    })[0];
}

function makeTeam() {
    const bestDesigner = getBestSkills('designer', 'Figma');
    const bestFrontend = getBestSkills('frontend', 'Angular');
    const bestBackend = getBestSkills('backend', 'Go');

    console.log(getInfo.call(bestDesigner.personal));
    console.log(getInfo.call(bestFrontend.personal));
    console.log(getInfo.call(bestBackend.personal));
}