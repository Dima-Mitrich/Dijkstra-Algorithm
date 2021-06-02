"use strict";

//Для задачи на поиск кратчайшего пути в матрице я выбрал алгоритм Дейкстры, т.к это по сути поиск кратчайшего 
//пути во взвешенном направленном графе и выбранный алгоритм подходит отлично. Суть в том что с каждым шагом мы
//выбираем вершину с наименьшим весом и пытаемся уменьшить вес ее соседей, таким образом находя минимальные расстояния до каждой вершины которая попадает в массив посещенных. 
//Алгоритм заканчивается когда непосещенной вершиной с наименьшим весом оказывается искомая. 
//Для контроля веса вершин я решил использовать обычный обьект с ключом номером узла и значением его веса. Из обьекта мы убераем вершины по мере их посещения 
//Для контроля посещенных узлов используется массив. Таким образом мы рассчитываем минимальные затраты "топлива".
//Для восстановления оптимального пути используется обьект "cameFrom" где мы отслеживаем какой именно "сосед" изменил
//вес узла на минимальный и затем как по хлебным крошкам возвращаемся из последнего узла в первый
//Так же по ходу понадобилась функция получения ключа по значения для вызова рекурсии для вершины с наименьшим весом     

//let map = [[1, 0, 3], [3, 1, 1], [2, 0, 1]];
//let map = [[0, 0, 7, 0, 0, 0], [7, 0, 0, 0, 7, 0], [7, 7, 7, 7, 7, 1]];
//let map = [[0, 0, 7], [7, 0, 7], [0, 0, 7], [0, 7, 7], [0, 0, 0]];
//let map = [[0,2,3,4,1], [2,3,4,4,1], [3,4,5,6,2], [4,5,6,7,1], [6,7,8,7,1]];
//let map = [[0,1,1,1,0],[1,1,3,1,1],[0,1,1,1,0], [0,0,0,0,0]];


function calculateRoverPath(map) {

    let visitedNodes = [];
    let countFuel = {};
    let cameFrom = {};

    //назначаем каждому узлу большой вес
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            countFuel['' + i + j] = 10000000;
        }
    }
    countFuel['00'] = 0;// меняем вес первого узла на 0


    //функция получения из обьекта ключа по значению
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }


    //алгоритм Дейкстры по поиску кратчайшего пути во взвешенном графе
    function dijkstra(number) {

        //из номера обьекта делаем номера для массива
        let i = parseInt(number.split('')[0]);
        let j = parseInt(number.split('')[1]);
        let countFuelToNeighborOne;
        let countFuelToNeighborTwo;
        let countFuelToNeighborThree;

        //условие выхода из рекурсии: достигнут последний элемент
        if (i == map.length - 1 && j == map[0].length - 1) return countFuel[`${i}${j}`];

        //шаг алгоритма: подсчет веса каждой соседней точки кроме уже пройденных и уменьшение веса
        if (i < map.length - 1 && !visitedNodes.includes(`${i + 1}${j}`)) {
            countFuelToNeighborOne = Math.abs(map[i][j] - map[i + 1][j]) + 1 + countFuel[`${i}${j}`];
            if (countFuel[`${i + 1}${j}`] > countFuelToNeighborOne) {
                countFuel[`${i + 1}${j}`] = countFuelToNeighborOne;
                cameFrom[`${i + 1}${j}`] = `${i}${j}`;
            }
        }
        if (j < map[0].length - 1 && !visitedNodes.includes(`${i}${j + 1}`)) {
            countFuelToNeighborTwo = Math.abs(map[i][j] - map[i][j + 1]) + 1 + countFuel[`${i}${j}`];;
            if (countFuel[`${i}${j + 1}`] > countFuelToNeighborTwo) {
                countFuel[`${i}${j + 1}`] = countFuelToNeighborTwo;
                cameFrom[`${i}${j + 1}`] = `${i}${j}`;
            }
        }
        if (i > 0 && !visitedNodes.includes(`${i - 1}${j}`)) {
            countFuelToNeighborThree = Math.abs(map[i][j] - map[i - 1][j]) + 1 + countFuel[`${i}${j}`];;
            if (countFuel[`${i - 1}${j}`] > countFuelToNeighborThree) {
                countFuel[`${i - 1}${j}`] = countFuelToNeighborThree;
                cameFrom[`${i - 1}${j}`] = `${i}${j}`;
            }
        }
        if (j > 0 && !visitedNodes.includes(`${i}${j - 1}`)) {
            countFuelToNeighborThree = Math.abs(map[i][j] - map[i][j - 1]) + 1 + countFuel[`${i}${j}`];;
            if (countFuel[`${i}${j - 1}`] > countFuelToNeighborThree) {
                countFuel[`${i}${j - 1}`] = countFuelToNeighborThree;
                cameFrom[`${i}${j - 1}`] = `${i}${j}`;
            }
        }
        //добвляем пройденный узел в массив посещенных и проверенных узлов
        visitedNodes.push(`${i}${j}`);

        //удаляем пройденный узел из обьекта еще не пройденных
        delete countFuel[`${i}${j}`];

        //повторяем шаг алгоритма со следующим узлом с наименьшим весом (предварительно отсортировав массив по возрастанию)
        return dijkstra(getKeyByValue(countFuel, Object.values(countFuel).sort((a, b) => a - b)[0]));

    }

    let fuelResult = dijkstra('00');

    let shortestPathArr = [`[${map.length - 1}][${map[0].length - 1}]`];
    let steps = 0;

    //сводим кратчайший путь в массив для удобства
    (function createShortestPath(node) {
        let i = parseInt(node.split('')[0]);
        let j = parseInt(node.split('')[1]);
        steps++;
        shortestPathArr.push(`[${i}][${j}]->`);
        if (node == '00') return;
        createShortestPath(cameFrom[`${i}${j}`]);
    })(cameFrom[`${map.length - 1}${map[0].length - 1}`]);

    //функция создания txt файла с результатами 
    function createPathPlanTxtFile(result) {
        let shortestPathStr = '';
        result.path.forEach(element => {
            shortestPathStr += element;
        });
        let finalText = `${shortestPathStr}\nsteps: ${result.steps}\nfuel:${result.fuel}`;
        let blob = new Blob([finalText],
            { type: "text/plain;charset=utf-8" });
        saveAs(blob, "path-plan.txt");
    }

    //функция загрузки библиотеки
    function fileSaverLibraryLoader() {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js';

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));

            document.head.append(script);
        });
    }

    let result = { path: shortestPathArr.reverse(), fuel: fuelResult, steps: steps };
    fileSaverLibraryLoader().then(() => createPathPlanTxtFile(result), (error) => alert(error));
}
