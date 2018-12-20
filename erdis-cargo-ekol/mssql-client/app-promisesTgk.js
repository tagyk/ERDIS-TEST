
const users = [{
    id: 1,
    name: 'Andrew',
    schoolId: 101
},
{
    id: 2,
    name: 'Ayşe',
    schoolId: 145
}];
const grades = [{
    id:1,
    schoolId: 101,
    grade: 85
},
{
    id:2,
    schoolId: 145,
    grade: 65
    },
{
    id:3,
    schoolId:101,
    grade: 91
    },
{
    id:4,
    schoolId:101,
    grade: 64
    }];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find((user) => user.id === id);
        if (user) {
            resolve(user);
        }
        else {
            reject(`Unable to find user with id of ${id}.`);
        }
    });
};

const getGrades = (schoolId) =>{
    return new Promise((resolve,reject) =>{
        resolve(grades.filter((grade)=> grade.schoolId === schoolId));
    })
}

const getStatus = (userId)=> {
    let user;
    return getUser(userId).then((tempUser) => {
        user=tempUser;
        return getGrades(user.schoolId);
    }).then((grades)=>{
        let average =0;

        if(grades.length>0){
            average = grades.map((grade ) => grade.grade).reduce((a,b) => a+b)/grades.length;
        }
        return `${user.name} has a ${average}% in the class.`;
    });
};

getStatus(1).then((status) => {
    console.log(status);
}
).catch((e) => {
    console.log(e);
});

