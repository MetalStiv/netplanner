import { useLocalObservable } from 'mobx-react-lite';
import Frame from 'react-frame-component'
import '../../styles/main.scss';
import { Panel } from './Panel';
import { createProjectStore } from '../../stores/projectStore'
import { ProjectProvider } from '../../providers/projectProvider';

function ProjectPage() {
    useLocalObservable(createProjectStore)

    return (
        <ProjectProvider>
            <div id="page-container">
                <div id="row-1">Главное меню</div>
                <div id="row-2">
                    <div id="column-1">
                        <Panel />
                    </div>
                    <div id="column-2">
                        <Frame id='renderer-frame'>

                        </Frame>
                    </div>
                    <div id="column-3">Панель</div>
                </div>
            </div>
        </ProjectProvider>
    );
}

export default ProjectPage;
