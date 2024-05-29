import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from '../Home/Home';
import { GameBoard } from '../GameBoard/GameBoard';
import { Admin } from '../Admin/Admin';
import { Events } from '../Events/Events';

export const Body = () => {
  return (
    <div>
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<Home />} />
      <Route path="/gameboard" element={<GameBoard />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </div>
  )
}