import React from 'react';

import './styles.scss';

export default () => {
    const categories = [
        {
          items: [{
            text: 'Architecture',
            monk: 'Single binary, distributed p2p',
            k8: 'Multiple services, top-down',
            terra: 'Tool',
          }]
        },
        {
          name: 'Infrastructure',
          items: [{
            text: 'Infrastructure provisioning',
            monk: true,
            k8: false,
            terra: true,
          },{
            text: 'Multi-cloud operation',
            monk: true,
            k8: false,
            terra: true,
          },{
            text: '3rd party service abstraction',
            monk: true,
            k8: false,
            terra: true,
          },{
            text: 'Volume management',
            monk: true,
            k8: true,
            terra: false,
          },{
            text: 'Ingress control',
            monk: 'Soon',
            k8: true,
            terra: false,
          },{
            text: 'Self-bootstrapping clusters',
            monk: true,
            k8: false,
            terra: false,
          },{
            text: 'Ephemeral clusters',
            monk: true,
            k8: false,
            terra: false,
          },{
            text: 'All clusters identical: dev/stage/prod',
            monk: true,
            k8: false,
            terra: false,
          }]
        },
        {
          name: 'Configuration (stack templates)',
          items: [{
            text: 'Portable across all environments',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Composable templates',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Fully integrated package registry',
            monk: true,
            k8: 'Sort of',
            terra: true
          },{
            text: 'Fully scriptable',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Custom scriptable actions',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Container lifecycle hooks',
            monk: true,
            k8: true,
            terra: false
          }]
        },
        {
          name: 'Container orchestration',
          items: [{
            text: 'In-cluster image transport',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Service discovery',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Encrypted overlay by default',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Encrypted at rest by default',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Fine grained network policies',
            monk: 'Soon',
            k8: true,
            terra: false
          },{
            text: 'Workload healing',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Auto-scaling',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Placement constraints',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Log management',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Container shell access',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Port forwarding',
            monk: true,
            k8: true,
            terra: false
          },{
            text: 'Run in development',
            monk: true,
            k8: false,
            terra: false
          },{
            text: 'Portable workloads',
            monk: true,
            k8: false,
            terra: false
          }]
        },
        {
          name: 'Other',
          items: [
            {
              text: 'API',
              monk: 'Websocket, simple',
              k8: 'Complex',
              terra: false
            },{
              text: 'Extend by templates',
              monk: true,
              k8: false,
              terra: false
            },{
              text: 'Extend core by operators / plugins',
              monk: 'Not needed',
              k8: true,
              terra: true
            },{
              text: 'Self contained, lightweight',
              monk: true,
              k8: false,
              terra: true
            }
          ]
        }
    ];

    return (
        <div className="features-table container">
            <div className="row d-flex align-center justify-content-center">
                <div className="col col--12 feature-table">
                <div className="table-row header">
                    <div className="content"><span>Feature</span></div>
                    <div className="including"><span>Monk</span></div>
                    <div className="including"><span>K8s / helm</span></div>
                    <div className="including"><span>Terraform</span></div>
                </div>
                {categories.map(category => (
                    <div className="">
                        {
                            category.name ?
                                <div className="table-row category">
                                    <div className="content">
                                        <p className="m-0">{category.name}</p>
                                    </div>
                                    <div className="including">
                                    </div>
                                    <div className="including">
                                    </div>
                                    <div className="including">
                                    </div>
                                </div> : null
                        }
                        {
                            category.items.map((item, index) => (
                                <div className="table-row">
                                    <div className="content">
                                        <p className="m-0">{item.text}</p>
                                    </div>
                                    <div className="including">
                                        {typeof item.monk === 'string' ?
                                            <span className="text-center">{item.monk}</span> :
                                        item.monk ?
                                            <img src="/img/docs/feature-check.svg" /> : null
                                        }
                                    </div>
                                    <div className="including">
                                        {typeof item.k8 === 'string' ?
                                            <span className="text-center">{item.k8}</span> :
                                        item.k8 ?
                                            <img src="/img/docs/feature-check.svg" /> : null
                                        }
                                    </div>
                                    <div className="including">
                                        {typeof item.terra === 'string' ?
                                            <span className="text-center">{item.terra}</span> :
                                        item.terra ?
                                            <img src="/img/docs/feature-check.svg" /> : null
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))}
                {/* <div className="" v-for="category in categories" :key="category.name">
                    <div v-if="category.name" className="table-row category">
                    <div className="content">
                        <p className="m-0">{{category.name}}</p>
                    </div>
                    <div className="including">
                    </div>
                    <div className="including">
                    </div>
                    <div className="including">
                    </div>
                    </div>
                    <div className="table-row" v-for="(item, index) in category.items" :key="index">
                    <div className="content">
                        <p className="m-0">{{item.text}}</p>
                    </div>
                    <div className="including">
                        <span v-if="typeof item.monk === 'string'" className="text-center">{{item.monk}}</span>
                        <img v-else-if="item.monk" src="~/assets/img/pricing/features/check.svg" />
                    </div>
                    <div className="including">
                        <span v-if="typeof item.k8 === 'string'" className="text-center">{{item.k8}}</span>
                        <img v-else-if="item.k8" src="~/assets/img/pricing/features/check.svg" />
                    </div>
                    <div className="including">
                        <span v-if="typeof item.terra === 'string'" className="text-center">{{item.terra}}</span>
                        <img v-else-if="item.terra" src="~/assets/img/pricing/features/check.svg" />
                    </div>
                    </div>
                </div> */}
                </div>
            </div>
        </div>
    );
}