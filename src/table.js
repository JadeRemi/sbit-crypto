
import React, { useState, useEffect }  from "react";

const tableContents = [
  {name: "Монета", identifier: "coin_name"},
  {name: "Курс к USDT", identifier: "price"},
  {name: "Общий баланс", identifier: "balance"},
  {name: "В ордерах", identifier: "frozen"},
  {name: "Свободный объем", identifier: "available"}
]
const sumContents = [
  {name: "Общий баланс (сумма):", identifier: "balance"},
  {name: "В ордерах (сумма):", identifier: "frozen"},
  {name: "Свободный объем (сумма):", identifier: "available"}
]
const availableUsers = [
  {name: "Пользователь 1", apikey: "http://api.sbit500.pro/api/testjob?id_user=1", key: "1"},
  {name: "Пользователь 2", apikey: "http://api.sbit500.pro/api/testjob?id_user=2", key: "2"}
]

const Table = () => {

  const [userNumber, setUserNumber] = useState(1);
  const [userActive, setUserActive] = useState(null);
  const [userCache, setUserCache] = useState(null);
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    retrieveContents.apply(this);

    function getData() {
      console.log("Updating finished!");
      contactApi.apply(this);
    }
    const interval = setInterval(() => getData(), 10000)
    return () => {
      clearInterval(interval);
    }
  }, []);

  async function contactApi(){
    let address = availableUsers[userNumber-1].apikey
    await fetch(address)
    .then(data => data.json())
    .then(data => {
      if (userActive) {
        let caching = [...userActive];
        setUserCache(caching);
      }

      setUserActive(data);
      
      if (userCache) {
        let refresh = [];
        userCache.map((x, i) => {
          if (userActive[i].price > userCache[i].price) {
            refresh.push("greentext");
          }
          else if (userActive[i].price < userCache[i].price) {
            refresh.push("redtext");
          }
          else {
            refresh.push("graytext");
          }
        });
        setAnalysis(refresh);
      }

    });
  };

  async function retrieveContents(){
    if (loading) {

      await contactApi()
      .then (() => {
        setLoading(false);
        toggleDropList();
      });
    }
  }

  function renderHeaderCells() {
    let headerCells = [];
    tableContents.map((x) => {
      headerCells.push(
        <th>{x.name}</th>
      );
      return headerCells;
    });
    return headerCells;
  }

  function renderResults(type, colorClassifier) {
    let results = [];
    tableContents.map((x, i) => {
      let keyValue = String(x.identifier);

      let cellContents = (keyValue == "coin_name")
        ? <td><img src={userActive[type].coin_img} alt="logo" className="cryptologo"></img>{` ${userActive[type][keyValue]} (${userActive[type].coin})`}</td>
        : <td className={colorClassifier}>{userActive[type][keyValue]}</td>;

      results.push(cellContents);
      return results;
    });
    return (
      <React.Fragment>
        <tr>{results}</tr>
      </React.Fragment>
      );
  }

  function renderRow(item) {
    let results = [];
    userActive.map((x, i) => {
      let colorClassifier = (analysis[i]) ? analysis[i] : "graytext"
      results.push(renderResults(i, colorClassifier));
      return results;
    });
    return (
      <React.Fragment>
        {results}
      </React.Fragment>
      );
  }

  function checkUser (name) {
      let userTag = document.getElementById('userSelect')
        ? document.getElementById('userSelect').firstChild
        : null;
      if (userTag) {
        userTag.innerHTML = "Пользователь " + name
        if (name != userNumber) {
          setUserNumber(name);
        }
        contactApi();
      }
      toggleDropList();
  }
  function toggleDropList() {
    const userDropList = document.getElementById('dropdown') ? document.getElementById('dropdown') : "";
    if (userDropList) {
      userDropList.style.display = (userDropList.style.display == 'none' ? '' : 'none')
    }
  }

  function userList() {
    let results = [];
    const dropUserList = document.getElementById('dropdown');
    availableUsers.map((userId) => {
      results.push(<tr><td><button onClick={() => checkUser(parseInt(userId.key))}>{String(userId.name)}</button></td></tr>);
    });
    return (
      <React.Fragment>
        {results}
      </React.Fragment>
    );
  }

  function renderSum() {
    let results = [];
    sumContents.map((sumType) => {
      let valueSum = 0;
      userActive.map((z)=>{
        valueSum += parseFloat(z[String(sumType.identifier)]);
      });
      results.push(<tr><td>{String(sumType.name)}</td><td>{valueSum}</td></tr>);
    });
    return (
      <React.Fragment>
        <tbody>
          {results}
        </tbody>
      </React.Fragment>
      );
  }

  return (
    <React.Fragment>
      {loading ? <div className="preloader">Загрузка</div> :
      <div>
        <table id="sum">
        {renderSum()}
        </table>
        <button id="userSelect" onClick={toggleDropList}><p className="userName">Пользователь 1</p></button>
        <table id="dropdown"><tbody>{userList()}</tbody></table>
        <table id="stocks">
          <thead>
            <tr>{renderHeaderCells()}</tr>
          </thead>
          <tbody>
            {renderRow()}
          </tbody>
        </table>
      </div>
      } 
    </React.Fragment>
  );
};

export default Table;