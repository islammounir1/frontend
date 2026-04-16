import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";


const data = [
  { name: "Sport", value: 40 },
  { name: "Études", value: 30 },
  { name: "Jeux", value: 20 },
  { name: "Autres", value: 10 }
];

const COLORS = ["#8884d8", "#3c35a7", "rgb(75, 87, 223)", "#141582"];

export default function Diagramme() {
  return (
    <div style={{ textAlign: "center", paddingTop: "70px", paddingBottom: "20px" }}>
      <h2>Diagramme des catégories</h2>

      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: 400 }}>
          <h3>Diagramme circulaire</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: "45%", height: 400 }}>
          <h3>Diagramme en barres</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </div>
  );
}