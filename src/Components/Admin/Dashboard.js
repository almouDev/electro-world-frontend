import {useEffect, useState} from "react";
import axios from "axios";
import {serverAdress} from "../../Pages/Constants";
import HttpService from "../../Services/services/HttpService.ts";
import {ResponsiveLine} from "@nivo/line"
import MyResponsiveBar from "./Bar";
import PropTypes from "prop-types";

export function Dashboard(){
    const [revenuMensuel,setRevenuMensuel]=useState([])
    const [averageMonthly,setAverage]=useState()
    const [revenueParCategorie,setRevenuCat]=useState([])
    useEffect(()=>{
        axios.get(`${serverAdress}/ventes/mensuel`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                let total_m=0;
                response.data.forEach(re=>{
                    total_m+=re.revenu
                })
                setAverage(total_m)
                setRevenuMensuel(()=>{
                    return response.data.map(ele=>{
                        return {
                            "y":ele.revenu,
                            "x":ele.date
                        }
                    })
                })
            })
        axios.get(`${serverAdress}/ventes/annuel`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                setRevenuCat(()=>{
                    return response.data.map(ele=>{
                        return {
                            "categorie":ele.categorie,
                            "revenu":ele.revenu
                        }
                    })
                })
            })
    },[])
    return(<div className={"container mt-3"}>
        <div className="d-flex justify-content-between">
            <div className="col-3 card p-0">
                <h3 className="card-header  w-100">Revenu (Dernier mois)</h3>
                <div className="card-body">{averageMonthly} DH</div>
            </div>
            <div className="card col-3 p-0">
                <h3 className="card-header">Commandes non livrées</h3>
                <div className="card-body"><NonDeliveredOrders/></div>
            </div>
        </div>
        <div className="card mt-3"><h4 className="card-header text-center">Quelques statistiques de ventes</h4>
            <div className="col-12 d-flex" style={{height:"350px"}}>
                    <div className="h-100 col-4">
                        <MyResponsiveLine data={revenuMensuel}/>
                    </div>
                <div className="col-8 h-100">
                    <MyResponsiveBar data={revenueParCategorie}/>
                </div>
            </div>
        </div>

    </div>)
}
const MyResponsiveLine = ({ data /* see data tab */ }) =>{
    return(
        <ResponsiveLine
            data={
            [{
                id:"1",
                data:data,
            }]
            }
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
                stacked:false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                format: '%b %d',
                tickValues: 'every 1 days',
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Statistiques de ventes du mois dernier',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Revenu',
                legendOffset: -50,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
)}
const NonDeliveredOrders=()=>{
    const [number,setNumber]=useState()
    useEffect(()=>{
        axios.get(`${serverAdress}/orders/non_delivered`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                setNumber(response.data.number)
            })
    })
    return <h4 className="text-danger">{number}</h4>
}