let collectedPoints = 0;
        const totalCells = 25;
        const pointEmojis = ['⭐', '🎯', '🏆', '🎪', '🎮', '🌟', '💎', '🎁'];

        // 初始化網格
        function initGrid() {
            const grid = document.getElementById('pointGrid');
            grid.innerHTML = '';
            
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'point-cell';
                cell.dataset.index = i;
                cell.innerHTML = '❓';
                cell.addEventListener('click', collectPoint);
                grid.appendChild(cell);
            }
        }

        // 集點功能
        function collectPoint(event) {
            const cell = event.target;
            
            // 如果已經集過點就不能再點
            if (cell.classList.contains('collected')) {
                return;
            }
            
            // 隨機選擇一個獎勵圖案
            const randomEmoji = pointEmojis[Math.floor(Math.random() * pointEmojis.length)];
            cell.innerHTML = randomEmoji;
            cell.classList.add('collected');
            
            collectedPoints++;
            updatePointDisplay();
            
            // 慶祝動畫
            showCelebration(randomEmoji);
            
            // 檢查獎勵
            checkRewards();
        }

        // 更新點數顯示
        function updatePointDisplay() {
            document.getElementById('pointCount').textContent = collectedPoints;
        }

        // 慶祝動畫
        function showCelebration(emoji) {
            const celebration = document.createElement('div');
            celebration.className = 'celebration';
            celebration.innerHTML = `+1 ${emoji}`;
            document.body.appendChild(celebration);
            
            setTimeout(() => {
                document.body.removeChild(celebration);
            }, 1000);
        }

        // 檢查可兌換獎勵
        function checkRewards() {
            const reward1 = document.getElementById('reward1');
            const reward2 = document.getElementById('reward2');
            const reward3 = document.getElementById('reward3');
            
            // 移除所有available類別
            reward1.classList.remove('available');
            reward2.classList.remove('available');
            reward3.classList.remove('available');
            
            // 根據點數添加available類別
            if (collectedPoints >= 10) {
                reward1.classList.add('available');
            }
            if (collectedPoints >= 20) {
                reward2.classList.add('available');
            }
            if (collectedPoints >= 25) {
                reward3.classList.add('available');
                // 全部集滿的特殊慶祝
                setTimeout(() => {
                    alert('🎉 恭喜！你集滿了所有點數！可以獲得特別獎品！');
                }, 500);
            }
        }

        // 產生保存碼
        function generateSaveCode() {
            const cellData = {};
            document.querySelectorAll('.point-cell.collected').forEach(cell => {
                cellData[cell.dataset.index] = cell.innerHTML;
            });
            
            const saveData = {
                points: collectedPoints,
                cells: cellData,
                date: new Date().toLocaleDateString()
            };
            
            // 使用 encodeURIComponent 和 btoa 來處理中文字符
            const saveCode = btoa(encodeURIComponent(JSON.stringify(saveData)));
            
            const displayDiv = document.getElementById('saveCodeDisplay');
            displayDiv.innerHTML = `
                <div style="margin: 10px 0;">
                    <strong>📋 保存碼 (請複製並保存)：</strong>
                </div>
                <div class="save-code">${saveCode}</div>
                <div style="font-size: 0.8em; color: #ccc;">
                    保存日期: ${saveData.date} | 點數: ${collectedPoints}
                </div>
            `;
        }

        // 載入進度
        function loadProgress() {
            const input = document.getElementById('loadInput');
            const saveCode = input.value.trim();
            
            if (!saveCode) {
                alert('請先貼上保存碼！');
                return;
            }
            
            try {
                // 使用 atob 和 decodeURIComponent 來解碼
                const saveData = JSON.parse(decodeURIComponent(atob(saveCode)));
                
                // 重置網格
                initGrid();
                
                // 恢復點數
                collectedPoints = saveData.points || 0;
                updatePointDisplay();
                
                // 恢復格子狀態
                if (saveData.cells) {
                    Object.keys(saveData.cells).forEach(index => {
                        const cell = document.querySelector(`[data-index="${index}"]`);
                        if (cell) {
                            cell.innerHTML = saveData.cells[index];
                            cell.classList.add('collected');
                        }
                    });
                }
                
                checkRewards();
                
                alert(`✅ 進度載入成功！\n保存日期: ${saveData.date}\n恢復點數: ${saveData.points}`);
                input.value = '';
                
            } catch (error) {
                alert('❌ 保存碼格式錯誤，請檢查後重試！');
            }
        }

        // 重置功能
        function resetPoints() {
            if (confirm('確定要重置集點卡嗎？所有進度都會消失！')) {
                collectedPoints = 0;
                updatePointDisplay();
                initGrid();
                checkRewards();
                document.getElementById('saveCodeDisplay').innerHTML = '';
                document.getElementById('loadInput').value = '';
            }
        }

        // 頁面載入時初始化
        window.onload = function() {
            initGrid();
            updatePointDisplay();
        };