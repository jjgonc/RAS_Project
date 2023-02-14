import './Transactions.css'
import { useEffect, useState } from 'react';
import {ServerUrl} from '../../ServerUrl'
import axios from 'axios';
import {Link} from 'react-router-dom'


const Transactions = () => {


    const [transactions,settransactions] = useState([])
    const [balance,setbalance] = useState([])
    const [currency,setCurrency] = useState('')


    const getCurrency = async () => {

        const userID = window.localStorage.getItem("user")
        if (userID != null){
            const res = await axios.post(ServerUrl + '/accounts/getCurrency', {
                id: userID
            })
    
            setCurrency(res.data.currency)
        }else {
            setCurrency('€')
        }
      }
      
    const getTransactions = async () => {
      
      const userID = window.localStorage.getItem("user")
      
      console.log(userID)
      
      const transactions = await axios.post(ServerUrl + '/accounts/getTransactions', {
        user:  userID
      })
            .then(response => {
                console.log("success");
                settransactions(response.data.transactions)
                setbalance(response.data.balance.$numberDecimal)
            }).catch((exception) => {
                console.log(exception);
            });
      
    }
      
      
    useEffect(() => {
        getTransactions()
        getCurrency()
    }, []);

  

    return (
        <div className='Transactions'>
          <div className="TransactionsHead"></div>
          <div className="TransactionsBox">
            <div className="TransactionsTitle">
                <Link to="/profile"><img className="TransactionsButtomBack" alt="" src="buttom_back.png"/></Link>
                <h2>Histórico de Transações</h2>  
            </div>
            <div className="TransactionsBalance">
              <h4>Saldo: {balance}{currency === 'EUR' ? ' €' : currency === 'BRL' ? ' R$' : currency === 'GBP' ? ' £' : ' $'}</h4>
            </div>
            
            <div className="TransactionsTable">
              <div className="TransactionsTableLeftTab"></div>
              <div className='TransactionsTableTable'>
              <table>
                <tbody className='TransactionsTbody'>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Operação</th>
                  <th>Saldo após movimento</th>
                </tr>
                {transactions.map(linha => (
                  <tr className='TransactionsList'>
                    {linha.split('|').map(item => (
                        <td>{item}</td>
                      )) 
                    }
                </tr>
                ))}
                </tbody>
              </table>
              </div>
            </div>


          </div>
        </div>
    )
}
export default Transactions