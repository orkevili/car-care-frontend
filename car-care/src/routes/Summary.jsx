import Container from "../components/Container";
import Title, { SmallTitle } from "../components/Title";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Legend, Bar } from 'recharts';
import { VehicleContext } from "../components/VehicleContext";
import { useMemo, useContext } from "react";

export default function Summary() {
    const { services, parts, activeVehicle } = useContext(VehicleContext);
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ name: m, cost: 0, part: 0 }));
        if (!services || services.length === 0) return data;
        services.forEach(service => {
            const date = new Date(service.date);
            const year = date.getFullYear();
            const monthIdx = date.getMonth();

            data[monthIdx].cost += Number(service.labor_cost);
            service.used_parts && Array.isArray(service.used_parts) && service.used_parts.forEach((parts) => {
                data[monthIdx].part += Number(parts.part_price)*Number(parts.quantity_used);
            })
        });
        return data;
    }, [services, parts, activeVehicle]);


    return (
        <Container>
            <Title>Summary</Title>
            <SmallTitle>Service costs and parts</SmallTitle>
            <ResponsiveContainer>
                <BarChart 
                    style={{ maxHeight: 600 }}
                    responsive
                    data={chartData}
                    margin={{top: 30, bottom: 30, left: 0, right: 50}}
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
        </Container>
    );
}