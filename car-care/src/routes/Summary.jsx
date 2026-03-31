import { Container } from "../components/Container";
import Title, { SmallTitle } from "../components/Title";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Legend, Bar } from 'recharts';
import { VehicleContext } from "../components/VehicleContext";
import { useMemo, useContext, useState, useEffect } from "react";
import { ModalOption, ModalSelect } from "../components/Modal";
import { toast } from "react-toastify";
import { useLocation } from "wouter";

export default function Summary() {
    const [ ,setLocation] = useLocation();
    const { services, parts, activeVehicle } = useContext(VehicleContext);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const availableYears = useMemo(() => {
        if (!services) return [new Date().getFullYear()];
        const years = services.map(s => new Date(s.date).getFullYear());
        const uniqueYears = [...new Set(years)];
        return uniqueYears.sort((a,b) => b - a);
    }, [services]);

    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ name: m, cost: 0, part: 0, odometer: 0 }));
        if (!services || services.length === 0) return data;
        services.forEach(service => {
            const date = new Date(service.date);
            const year = date.getFullYear();
            if (year === selectedYear) {
                const monthIdx = date.getMonth();
                data[monthIdx].cost += Number(service.labor_cost);
                data[monthIdx].odometer += Number(service.odometer);
                service.used_parts && Array.isArray(service.used_parts) && service.used_parts.forEach((parts) => {
                    data[monthIdx].part += Number(parts.part_price)*Number(parts.quantity_used);
                })
            }
        });
        return data;
    }, [services, parts, activeVehicle, selectedYear]);


    useEffect(() =>{
        if (!activeVehicle) {
            toast.warn("Please select a vehicle!");
            setLocation('/garage');
        }
    }, [activeVehicle]);


    return (
        <Container>
            <Title>Summary</Title>
            <SmallTitle>Service costs and parts</SmallTitle>
             <ModalSelect name="year" id="year" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                {availableYears.map(year => (
                    <ModalOption key={year} value={year}>{year}</ModalOption>
                ))}
            </ModalSelect>
            <ResponsiveContainer>
                <BarChart 
                    style={{ maxHeight: '80vh', maxWidth: 'max-content' }}
                    responsive
                    data={chartData}
                    margin={{top: 0, bottom: 10, left: 50, right: 30}}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="cost" />
                <Tooltip />
                <Legend /> 
                <Bar dataKey="cost" fill="#09f0dc" activeBar={{fill: '#34b9a3', stroke: '#03caa9'}} radius={[10, 10, 0, 0]} />
                <Bar dataKey="part" fill="#00ff62" activeBar={{fill: '#34b9a3', stroke: 'green'}} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart
                    style={{ maxHeight: '80vh', maxWidth: 'max-content' }}
                    margin={{top: 0, bottom: 10, left: 50, right: 30}}
                    responsive
                    data={chartData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="odometer" />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="odometer"
                        dot={{ fill: "#000000" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    );
}